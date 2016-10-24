#/bin/sh
set -e

RELEASE_FOLDER=./dist
RELEASE_BRANCH_NAME=testRelease
RELEASE_GIT_NAME="Bob Builder"
RELEASE_GIT_MAIL="info@mwaysolutions.com"

exit_with_error () {
    echo $1
    exit 1
}

# Check if VERSION_NUMBER env variable is set. The version number will be set by grunt because
# it is a combination of the version number of the package json, build number and commit hash
if [ -z "$VERSION_NUMBER" ]
then
  echo In order to release the env variable VERSION_NUMBER has to bet set!
  exit 1
fi

# Check if GH_REF, $GH_USER and GH_TOKEN env variables are set. They are configured in .travis.yml
if [ -z "$GH_REF" ] || [ -z "$GH_TOKEN" ]
then
  echo In order to release the env variable GH_REF and GH_TOKEN has to be set!
  exit 1
fi

# Set or add the remote url for the github repo with the GH_TOKEN
# The GH_TOKEN is a github personal access token https://github.com/settings/tokens
# It is encrypted with travis `$ travis encrypt GH_TOKEN=<GH_PERSONAL_TOKEN>` and set as global env via the .travis.yml
if git remote | grep origin_gh > /dev/null
then
  git remote set-url origin_gh https://$GH_TOKEN@$GH_REF.git
else
  git remote add origin_gh https://$GH_TOKEN@$GH_REF.git
fi
git fetch origin_gh

echo "##########################################"
echo "#                                        #"
echo "# Releasing version ${VERSION_NUMBER}... #"
echo "#                                        #"
echo "##########################################"

# This replaces the current commiter for the release
# The current commiter is saved so we can set it correctly after the process
# Travis does not have a commiter set
CURRENT_GIT_USER=`git config user.name`
CURRENT_GIT_USERMAIL=`git config user.email`
git config user.name "$RELEASE_GIT_NAME"
git config user.email "$RELEASE_GIT_MAIL"

# Save the latest commit hash so we can reset to it later
LATEST_COMMIT_HASH_BEFORE_RELEASE=`git rev-parse --verify HEAD`

# The .releaseignore becomes the gitignore for the release so that files that are actually ignored can be released (e.g. the dist folder)
# After the commit the actual .gitignore will be set
mv ./.gitignore ./.ignore_tmp
mv ./.releaseignore ./.gitignore

git add -A
git commit -m "release version ${VERSION_NUMBER}"

mv ./.gitignore ./.releaseignore
mv ./.ignore_tmp ./.gitignore

# The release commit hash is saved as var for the cherry-pcik
RELEASE_COMMIT_HASH=`git rev-parse --verify HEAD`

# The current branch is saved as var so we can switch back to that branch later
CURRENT_BRANCH=`git rev-parse --abbrev-ref HEAD`

# Check if the release branch already exists
if [ `git branch -r --list origin_gh/$RELEASE_BRANCH_NAME` ]
then
  # branch already exists so we get the current remote version
  git branch $RELEASE_BRANCH_NAME origin_gh/$RELEASE_BRANCH_NAME
  git checkout $RELEASE_BRANCH_NAME
  git pull origin_gh $RELEASE_BRANCH_NAME
elif [ `git branch --list $RELEASE_BRANCH_NAME` ]
then
  # branch exists only locally
  git checkout $RELEASE_BRANCH_NAME
else
  # branch does not exist so it is created
  git checkout -b $RELEASE_BRANCH_NAME
fi

# Cherry pick the release commit from the master branch
git cherry-pick $RELEASE_COMMIT -X theirs

# Push cherry-pick to release branch
#git push origin_gh $RELEASE_BRANCH_NAME --no-verify > /dev/null 2>&1 || exit_with_error "Could not push to branch release"

# Create tag and push it
git tag v${VERSION_NUMBER}
#git push origin_gh v${VERSION_NUMBER} --no-verify > /dev/null 2>&1 || exit_with_error "Could not publish tag v${VERSION_NUMBER}"

# Setting everything back to the beginning
git checkout $CURRENT_BRANCH -f
git reset --hard $LATEST_COMMIT_HASH_BEFORE_RELEASE
git config user.name "$CURRENT_GIT_USER"
git config user.email "$CURRENT_GIT_USERMAIL"
git remote remove origin_gh

echo "##########################################"
echo "#                                        #"
echo "# Version ${VERSION_NUMBER} is released! #"
echo "#                                        #"
echo "##########################################"