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

data "aws_caller_identity" "current" {}

data "aws_ssm_parameter" "environment" {
  name = "environment"
}

data "aws_ssm_parameter" "lambda_binary_bucket" {
  name = "/common/secrets/lambda_binary_bucket"
}

