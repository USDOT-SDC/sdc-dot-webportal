terraform {
  required_version = "~> 1.6"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.24"
    }
  }
  backend "s3" {
    // Variables may not be used here.
    region = "us-east-1"
    key    = "sdc-dot-webportal/terraform/terraform.tfstate"
  }
}

provider "aws" {
  region = local.region_name
  default_tags {
    tags = {
      repository-url = local.repository-url
      repository     = local.repository
    }
  }
}
