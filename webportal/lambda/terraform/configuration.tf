provider "aws" {
  version = "~> 2.0"
  region  = "us-east-1"
  profile = "sdc"
}

terraform {
  required_version = "~> 0.12"

  # All backend values must be supplied at init-time
  backend "s3" {
        key = "sdc-dot-webportal/webportal/lambda/terraform/terraform.tfstate"
        region = "us-east-1"
  }
}


data "aws_ssm_parameter" "account_number" {
  name = "/common/secrets/account_number"
}

data "aws_ssm_parameter" "environment" {
  name = "/common/secrets/environment"
}

data "aws_ssm_parameter" "lambda_binary_bucket" {
  name = "/common/secrets/lambda_binary_bucket"
}

#data "local_file" "webportal_lambda_policy_json" {
#  filename = "webportal_lambda_policy.json"
#}

