
variable "deploy_env" {
  type        = string
  description = "Deploy environment (dev, prod, test)"
}

variable "webportal_bucket_name" {
  type        = string
  description = "The name for the bucket in which we store all the webportal static assets"
}

variable "aws_region" {
  type = string
  default = "us-east-1"
}

variable "lambda_name" {
  type = string
  default = "add-metadata-to-s3-object"
}

variable "lambda_binary_bucket" {
  type = string
}

variable "account_number" {
  type = string
  default = "911061262852"
}

variable "EXPORT_REQUEST_FOLDER" {
  type = string
  default = "export_requests"
}

variable "lambda_trigger_buckets" {
  type = list(string)
}

variable "DYNAMODB_AVAILABLE_DATASET" {
  type = string
  default = "prod-AvailableDataset"
}

variable "EMAIL_SENDER" {
  type = string
  default = "sdc-support@dot.gov"
}

variable "SDI_TEAM_BUCKET" {
  type = string
  default = "prod-sdc-sdi-004118380849"
}

variable "TFHRC_TEAM_BUCKET" {
  type = string
  default = "prod-sdc-waze-covid-004118380849"
}

variable "WAZE_AUTOEXPORT_BUCKET" {
  type = string
  default = "prod-sdc-waze-autoexport-004118380849"
}

variable "WYDOT_AUTOEXPORT_BUCKET" {
  type = string
  default = "prod-sdc-wydot-autoexport-004118380849"
}

variable "WYDOT_TEAM_BUCKET" {
  type = string
  default = "prod-sdc-wydot-004118380849"
}

#
# locals to be provided globally
#
locals {
  global_tags = {
    "SourceRepo"  = "sdc-dot-webportal"
    "Project"     = "SDC-Platform"
    "Team"        = "sdc-platform"
    "Environment" = var.deploy_env
    "Owner"       = "SDC support team"
  }
}
