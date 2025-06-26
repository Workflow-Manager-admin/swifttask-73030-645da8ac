#!/bin/bash
cd /home/kavia/workspace/code-generation/swifttask-73030-645da8ac/remix_frontend_workspace/remix_frontend
npx eslint
ESLINT_EXIT_CODE=$?
npm run build
BUILD_EXIT_CODE=$?
 if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi

