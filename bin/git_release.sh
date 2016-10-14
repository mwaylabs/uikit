set -e

# Check if VERSION_NUMBER env variable is set. The version number will be set by grunt because
# it is a combination of the version number of the package json, build number and commit hash
if [ -z "$VERSION_NUMBER" ]
then
  echo In order to release the env variable VERSION_NUMBER has to bet set!
  exit 1
fi

# Check if GH_REF, $GH_USER and GH_TOKEN env variables are set. They are configured in .travis.yml
if [ -z "$GH_REF" ] || [ -z "$GH_TOKEN" ] || [ -z "$GH_USER" ]
then
  echo In order to release the env variable GH_REF, $GH_USER and GH_TOKEN has to be set!
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
git config user.name "Bob Builder"
git config user.email "info@mwaysolutions.com"

# We are switching branches soon so we remember the current branch
CURRENT_BRANCH=`git rev-parse --abbrev-ref HEAD`
if [ `git branch --list release` ]
then
  mkdir -p /tmp/releases/uikit
  mv dist /tmp/releases/uikit

  git checkout origin_gh/release
  git pull origin_gh release

  # The temp branch is selected after wards
  mv /tmp/releases/uikit ./dist
  rm -rf /tmp/releases/uikit
else
  git checkout --orphan release
  git reset
fi

git add dist/* -f
git commit -m "release version ${VERSION_NUMBER}"
git push origin_gh release --no-verify

git tag v${VERSION_NUMBER}
git push origin_gh v${VERSION_NUMBER} --no-verify

# Setting everything back to the beginning
git checkout $CURRENT_BRANCH
git config user.name "$CURRENT_GIT_USER"
git config user.email "$CURRENT_GIT_USERMAIL"

echo "##########################################"
echo "#                                        #"
echo "# Version ${VERSION_NUMBER} is released! #"
echo "#                                        #"
echo "##########################################"