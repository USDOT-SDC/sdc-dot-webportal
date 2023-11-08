variable "lambda_name" {
  type    = string
  default = "add-metadata-to-s3-object"
}

variable "EXPORT_REQUEST_FOLDER" {
  type    = string
  default = "export_requests"
}

variable "lambda_trigger_buckets_dev" {
  type = list(string)
  default = [
    "dev.sdc.dot.gov.team.sdc-support"
  ]
}

variable "lambda_trigger_buckets_prod" {
  type = list(string)
  default = [
    "prod-sdc-fta-004118380849",
    "prod-sdc-icf-004118380849",
    "prod-sdc-sdi-004118380849",
    "prod-sdc-waze-academic-tamu-004118380849",
    "prod-sdc-waze-academic-unc-004118380849",
    "prod-sdc-waze-autoexport-004118380849",
    "prod-sdc-waze-ccp-academic-004118380849",
    "prod-sdc-waze-covid-004118380849",
    "prod.sdc.dot.gov.team.acme-research-team",
    "prod.sdc.dot.gov.team.sdc-support"
  ]
}

variable "SDI_TEAM_BUCKET" {
  type    = string
  default = "prod-sdc-sdi-004118380849"
}

variable "TFHRC_TEAM_BUCKET" {
  type    = string
  default = "prod-sdc-waze-covid-004118380849"
}

variable "WAZE_AUTOEXPORT_BUCKET" {
  type    = string
  default = "prod-sdc-waze-autoexport-004118380849"
}

locals {
  region_name              = "us-east-1"
  account_id               = data.aws_ssm_parameter.account_id.value
  environment              = data.aws_ssm_parameter.environment.value
  terraform_bucket         = "${data.aws_ssm_parameter.environment.value}.sdc.dot.gov.platform.terraform"
  webportal_bucket         = "${data.aws_ssm_parameter.environment.value}-webportal-hosting-${data.aws_ssm_parameter.account_id.value}"
  available_datasets_table = "${data.aws_ssm_parameter.environment.value}-AvailableDataset"
  lambda_trigger_buckets   = data.aws_ssm_parameter.environment.value == "dev" ? var.lambda_trigger_buckets_dev : var.lambda_trigger_buckets_prod
  repository-url           = "https://github.com/USDOT-SDC/"
  repository               = "sdc-dot-webportal"
  sdc_support              = data.aws_ssm_parameter.environment.value == "dev" ? var.dev-support : var.sdc-support
  sdc_admins               = data.aws_ssm_parameter.environment.value == "dev" ? var.dev-admins : var.sdc-admins
  global_tags = {
    "Project" = "SDC-Platform"
    "Team"    = "SDC-Platform"
    "Owner"   = "SDC Support Team"
  }
}

variable "sdc-support" {
  default = {
    name  = "SDC Support"
    email = "sdc-support@dot.gov"
  }
}

variable "sdc-admins" {
  default = {
    name  = "SDC Admins"
    email = "sdc-admins@dot.gov"
  }
}

variable "dev-support" {
  default = {
    name  = "Will Sharp"
    email = "William.Sharp.ctr@dot.gov"
  }
}

variable "dev-admins" {
  default = {
    name  = "Will Sharp"
    email = "William.Sharp.ctr@dot.gov"
  }
}
