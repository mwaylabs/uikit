#/bin/sh
set -e

RELEASE_GIT_NAME="Bob Builder"
RELEASE_GIT_MAIL="info@mwaysolutions.com"

CURRENT_GIT_USER=`git config user.name`
CURRENT_GIT_USERMAIL=`git config user.email`
CURRENT_BRANCH=`git rev-parse --abbrev-ref HEAD`

# Sets everything back to the beginning, before the release process has been started
reset () {
    git reset --hard origin/$CURRENT_BRANCH
    git config user.name "$CURRENT_GIT_USER"
    git config user.email "$CURRENT_GIT_USERMAIL"
    git remote remove origin_gh
}

# Shows error message and exits with statuscode 1
exit_with_error () {
    echo $1
    exit 1
}

# Calls function when script exits (error and success)
trap reset EXIT

# Check if VERSION_NUMBER env variable is set. The version number will be set by grunt because
# it is a combination of the version number of the package json, build number and commit hash
if [ -z "$VERSION_NUMBER" ]
then
  echo In order to release the env variable VERSION_NUMBER has to bet set!
  exit 1
fi

# Check if GH_REF and GH_TOKEN env variables are set. They are configured in .travis.yml
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
git tag -a v${VERSION_NUMBER} -m "Version ${VERSION_NUMBER}"
git push origin_gh --tags --no-verify > /dev/null 2>&1 || exit_with_error "Could not publish tag v${VERSION_NUMBER}"

echo "##########################################"
echo "#                                        #"
echo "# Version ${VERSION_NUMBER} is released! #"
echo "#                                        #"
echo "##########################################"