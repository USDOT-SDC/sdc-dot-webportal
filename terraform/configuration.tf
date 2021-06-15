terraform {
  required_version = "~> 0.15"
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
  backend "s3" {
    region = "us-east-1"
    // Don't forget to change this to {repo_name}/terraform/terraform.tfstate
    key = "sdc-dot-webportal/terraform/terraform.tfstate"
  }
}

provider "aws" {
  region = "us-east-1"
  profile = "sdc"
  default_tags {
    tags = {
      Repo = "sdc-dot-webportal"
    }
  }
}