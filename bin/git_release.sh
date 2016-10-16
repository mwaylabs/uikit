#/bin/sh
set -e

RELEASE_FOLDER=./dist
RELEASE_BRANCH_NAME=release
RELEASE_GIT_NAME="Bob Builder"
RELEASE_GIT_MAIL="info@mwaysolutions.com"

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
git fetch

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

# We are switching branches soon so we remember the current branch
CURRENT_BRANCH=`git rev-parse --abbrev-ref HEAD`
if [ `git branch --list release` ]
then
  # We have to move the current release into a tmp folder because otherwise we get a merge error and can not
  # switch the branches
  RELEASE_ID=$(date +%s)
  mkdir -p /tmp/releases/ui-kit/$RELEASE_ID
  mv $RELEASE_FOLDER /tmp/releases/ui-kit/$RELEASE_ID

  # We switch to our release branch'
  git checkout $RELEASE_BRANCH_NAME
  git pull origin_gh $RELEASE_BRANCH_NAME -X ours

  # We replace the files of our relase folder with the files from our tmp folder
  # the tmp folder is removed afterwards
  rm -rf $RELEASE_FOLDER
  mv -f /tmp/releases/ui-kit/$RELEASE_ID $RELEASE_FOLDER
  rm -rf /tmp/releases/ui-kit/$RELEASE_ID
else
  git checkout --orphan $RELEASE_BRANCH_NAME
  git reset
fi

# We add our release folder. By setting -f the .gitignore is ignored so the folder can be added even when it is on .gitignore
git add $RELEASE_FOLDER -f

if [ "$(git diff --cached --exit-code)" ]
then
  git commit -m "release version ${VERSION_NUMBER}"
  git push origin_gh $RELEASE_BRANCH_NAME --no-verify > /dev/null 2>&1 || echo "Failed to push to release branch" && exit 1

  git tag v${VERSION_NUMBER}
  git push origin_gh v${VERSION_NUMBER} --no-verify > /dev/null 2>&1 || echo "Failed to release the tag v${VERSION_NUMBER}" && exit 1
else
  echo "${VERSION_NUMBER} did not contain any changes so the release is skipped"
fi

# Setting everything back to the beginning
git checkout $CURRENT_BRANCH -f
git config user.name "$CURRENT_GIT_USER"
git config user.email "$CURRENT_GIT_USERMAIL"
git remote remove origin_gh

echo "##########################################"
echo "#                                        #"
echo "# Version ${VERSION_NUMBER} is released! #"
echo "#                                        #"
echo "##########################################"