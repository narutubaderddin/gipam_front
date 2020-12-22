#!/usr/bin/env bash

set -e

#Deployment package absolute path
DEPLOYMENT_PACKAGE_PATH=$1
#Current directory where the deploy script where executed
WORKING_DIR=$(pwd)
#Target project name
TARGET_PROJECT_NAME="GIPAM-Frontend"
#Deployment's current datetime
CURRENT_DATETIME=$(date +'%Y-%m-%d_%H%M%S')
#Backup temporary directory
BACKUP_TEMP_DIR=${WORKING_DIR}/../${TARGET_PROJECT_NAME}_backup_temp_${CURRENT_DATETIME}

#Rollback function
deployment_rollback() {
    echo "➡️ Gipam Frontend Deployment :: Running Rollback"
    cp -RT $BACKUP_TEMP_DIR $WORKING_DIR
    mv $WORKING_DIR $WORKING_DIR/../${TARGET_PROJECT_NAME}_deploy_rollback_${CURRENT_DATETIME}
    mv $BACKUP_TEMP_DIR $WORKING_DIR/
    echo "➡️ Gipam Frontend Deployment :: Rollback successfully"
}

#backup function
deployment_backup() {
    echo "➡️ Gipam Frontend Deployment :: Running Backup"
    cd ../
    mv $WORKING_DIR $BACKUP_TEMP_DIR
    mkdir $WORKING_DIR
    cd $BACKUP_TEMP_DIR
    BACKUP_TEMP_DIR=$(pwd)
    cd ..
    echo "➡️ Gipam Frontend Deployment :: Backup successfully"
}

if [ ! -f "$DEPLOYMENT_PACKAGE_PATH" ];
then
   echo "❎ Package $DEPLOYMENT_PACKAGE_PATH does not exist" >&2
   exit 1
fi

echo "➡️ Gipam Frontend Deployment :: Backuping main project"
deployment_backup

echo "➡️ Gipam Frontend Deployment :: Extracting deployment package"
tar -xf ${DEPLOYMENT_PACKAGE_PATH} --strip-components=1 -C ${WORKING_DIR}

cd ..
cd ${WORKING_DIR}
trap "deployment_rollback" ERR

echo "➡️ GIPAM Frontend Deployment :: Creating Backup archive for old project version directory to" ${BACKUP_TEMP_DIR}.tar.gz
tar -czf ${WORKING_DIR}_backup_${CURRENT_DATETIME}.tar.gz ${BACKUP_TEMP_DIR} || true
rm -rf ${BACKUP_TEMP_DIR} || true

cd ..
cd ${WORKING_DIR}
echo "➡️ GIPAM Frontend Deployment :: success ✔✔✔✔"

