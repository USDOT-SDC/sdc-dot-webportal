#!/bin/bash

rm -rf .terraform
aws s3 rm s3://${AWS_ENVIRONMENT}.sdc.dot.gov.platform.terraform/sdc-dot-webportal/webportal/lambda/terraform/ --recursive

