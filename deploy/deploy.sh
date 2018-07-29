#!/bin/bash
DYNAMO_DB_TABLE_NAME='alexa-voice_qa'
pwd=`(cd $(dirname $0) && pwd)`

mkdir -f ../artifacts
aws cloudformation package --template-file ${pwd}/sam.yml --s3-bucket deploy-packages.hiroyky.com --output-template-file ${pwd}/../artifacts/sam.yml
aws cloudformation deploy --template-file ${pwd}/../artifacts/sam.yml \
--stack-name alexa-voiceqa-skill \
--capabilities CAPABILITY_NAMED_IAM \
--parameter-overrides \
    DynamoDBTableName=${DYNAMO_DB_TABLE_NAME} \
