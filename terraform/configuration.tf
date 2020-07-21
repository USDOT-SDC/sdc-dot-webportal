provider "aws" {
  version = "~> 2.0"
  region  = "us-east-1"
  profile = "sdc"
}

terraform {
  required_version = "~> 0.12"

  # All backend values must be supplied at init-time
  backend "s3" {
  }
}
