#/bin/sh
set -e

RELEASE_GIT_NAME="Bob Builder"
RELEASE_GIT_MAIL="info@mwaysolutions.com"

CURRENT_GIT_USER=`git config user.name`
CURRENT_GIT_USERMAIL=`git config user.email`
CURRENT_BRANCH=`git rev-parse --abbrev-ref HEAD`

get_version () {
 local version=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

  echo $version
}

get_changelog () {
 local changelog=$(sed -n -e "/# v$1/,/# v/ p" CHANGELOG.md | sed -e '1d;$d')

 echo $changelog
}

# Sets everything back to the beginning, before the release process has been started
reset () {
    git reset --hard origin/$CURRENT_BRANCH
    git config user.name "$CURRENT_GIT_USER"
    git config user.email "$CURRENT_GIT_USERMAIL"
}

# Shows error message and exits with statuscode 1
exit_with_error () {
    echo $1
    exit 1
}

# Set version number from package json version
VERSION_NUMBER=$(get_version)
CHANGELOG=$(get_changelog $VERSION_NUMBER)

# Check if user is on branch master
#if [ "$CURRENT_BRANCH" != "master" ]; then
#  exit_with_error "You are on branch $CURRENT_BRANCH. This script can be only executed on master branch"
#fi

# Check if there are any local changes that are not committed yet
#if [ -n "$(git status --porcelain)" ]; then
#  git status --porcelain
#  exit_with_error "There are changes that are not committed yet. Make sure you have checked in all changes before you run this script!";
#fi

# Check if all changes have been pushed to remote
#if [ "$(git log origin/$CURRENT_BRANCH..HEAD)" ]; then
#  exit_with_error "Not all changes are pushed! Please push all changes before you run this script"
#fi

# Check if version is mentioned in CHANGELOG.md
if [ "$CHANGELOG" == "" ] ; then
  exit_with_error "No entry was found in CHANGELOG.md that highlights the changes of v$VERSION_NUMBER. Please create an entry \"# v$VERSION_NUMBER\" and write down the changes"
fi

# Check if a tag with the same version already exists
if [ "$(git ls-remote origin refs/tags/v$VERSION_NUMBER)" ]; then
 exit_with_error "The version ${VERSION_NUMBER} has been already released. Increment version number of package.json in order to create a new release"
fi

echo "##########################################"
echo "#                                        #"
echo "# Building version ${VERSION_NUMBER}... #"
echo "#                                        #"
echo "##########################################"

grunt release

echo "##########################################"
echo "#                                        #"
echo "# Releasing version ${VERSION_NUMBER}... #"
echo "#                                        #"
echo "##########################################"

# Calls function when script exits (error and success)
trap reset EXIT

# This replaces the current commiter for the release
git config user.name "$RELEASE_GIT_NAME"
git config user.email "$RELEASE_GIT_MAIL"

# The .releaseignore becomes the gitignore for the release so that files that are actually ignored can be released (e.g. the dist folder)
# After the commit the actual .gitignore will be set
mv .gitignore .ignore_tmp
cp .releaseignore .gitignore

git add -A
git reset .gitignore
git reset .ignore_tmp
git reset .releaseignore
if [ "$(git diff --cached --exit-code)" ]
then
  git commit -m "release version ${VERSION_NUMBER}"
  RELEASE_COMMIT_HASH=`git rev-parse --verify HEAD`
else
  mv .gitignore .releaseignore
  mv .ignore_tmp .gitignore
  exit_with_error "${VERSION_NUMBER} did not contain any changes so the release is aborted"
fi

mv .gitignore .releaseignore
mv .ignore_tmp .gitignore

# Create tag and push it
git tag -a v${VERSION_NUMBER} -m "Version ${VERSION_NUMBER} \n ${CHANGELOG}"
git push origin --tags --no-verify > /dev/null 2>&1 || exit_with_error "Could not publish tag v${VERSION_NUMBER}"

echo "##########################################"
echo "#                                        #"
echo "# Version ${VERSION_NUMBER} is released! #"
echo "#                                        #"
echo "##########################################"