#!/bin/bash
cd /home/kavia/workspace/code-generation/recipeexplorer-66392-19267150/frontend_app_workspace/frontend_app
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

