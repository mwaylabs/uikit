#!/bin/bash -e

green=`tput setaf 2`
reset=`tput sgr0`

if [ -z "$UIKIT_COPY_PATH" ]
then
  echo "In order to copy the uikit to the relution portal folder env variable ${green}UIKIT_COPY_PATH${reset} has to bet set!"
  echo "To create the env variable run: ${green}export UIKIT_COPY_PATH=YOUR_PATH_WHERE_TO_COPY_DIST_FOLDER${reset}"
  echo "Save this command in the ${green}.bashrc${reset} file so its available after restart"
  exit 1
fi

grunt build
cp -R dist $UIKIT_COPY_PATH
echo ""
echo ""
echo "#######################################################"
echo "# ${green}DONE. Copied the build to ${UIKIT_COPY_PATH}${reset}"
echo "#######################################################"
