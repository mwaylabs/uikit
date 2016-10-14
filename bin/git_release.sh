# Check if VERSION_NUMBER env variable is set. The version number will be set by grunt because
# it is a combination of the version number of the package json, build number and commit hash
if [ -z "$VERSION_NUMBER" ]
then
  echo In order to release the env variable VERSION_NUMBER has to bet set!
  exit -1
fi

# Check if GH_REF, $GH_USER and GH_TOKEN env variables are set. They are configured in .travis.yml
if [ -z "$GH_REF" ] || [ -z "$GH_TOKEN" ] || [ -z "$GH_USER" ]
then
  echo In order to release the env variable GH_REF, $GH_USER and GH_TOKEN has to be set!
  exit -1
fi

git init

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

# We deactivate the gitignore for the release process because we have to commit the dist folder
# that is actually ignored
mv .gitignore .ignore_gitignore

# We are switching branches soon so we remember the current branch
CURRENT_BRANCH=`git rev-parse --abbrev-ref HEAD`
if [ `git branch --list release` ]
then
  # We create a new temp branch where we are commiting the current dist state
  # The commit hash is rembered so we can cherry pick it later in our actual release branch
  git checkout --orphan __tmp_release
  git reset
  git add dist/*
  git commit -m "release version ${VERSION_NUMBER}"
  RELEASE_COMMIT_HASH=`git rev-parse HEAD`

  # We are checking out our release branch and do a cherry pick of our tmp release branch with a merge strategy
  # Every merge conflict is replaced with the state of our latest release from the temp branch
  git checkout release;
  git pull origin_gh release;
  git cherry-pick -X theirs $RELEASE_COMMIT_HASH

  # The temp branch is seleted after wards
  git branch -D __tmp_release
else
  git checkout --orphan release
  git reset
  git add dist/*
  git commit -m "release version ${VERSION_NUMBER}"
fi

git push --quiet origin_gh release > /dev/null 2>&1

git tag v${VERSION_NUMBER}
git push --quiet origin_gh v${VERSION_NUMBER} > /dev/null 2>&1

# Setting everything back to the beginning

git checkout $CURRENT_BRANCH

mv .ignore_gitignore .gitignore

git config user.name "$CURRENT_GIT_USER"
git config user.email "$CURRENT_GIT_USERMAIL"

unset VERSION_NUMBER