// Use _root.tf to pull info on existing resources and call modules
data "aws_caller_identity" "current" {}

data "aws_ssm_parameter" "environment" {
  name = "environment"
}

data "aws_ssm_parameter" "account_id" {
  name = "account_id"
}

data "aws_vpc" "default" {
  filter {
    name   = "tag:Name"
    values = ["Default"]
  }
}

data "aws_subnet" "support" {
  vpc_id = data.aws_vpc.default.id
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
  filter {
    name   = "tag:Name"
    values = ["Support Workstations"]
  }
}

data "aws_subnet" "researcher" {
  vpc_id = data.aws_vpc.default.id
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
  filter {
    name   = "tag:Name"
    values = ["Researcher Workstations"]
  }
}

data "aws_subnet" "infrastructure_3" {
  vpc_id = data.aws_vpc.default.id
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
  filter {
    name   = "tag:Name"
    values = ["Infrastructure 3"]
  }
}

data "aws_subnet" "infrastructure_4" {
  vpc_id = data.aws_vpc.default.id
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
  filter {
    name   = "tag:Name"
    values = ["Infrastructure 4"]
  }
}

data "aws_subnet" "infrastructure_5" {
  vpc_id = data.aws_vpc.default.id
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
  filter {
    name   = "tag:Name"
    values = ["Infrastructure 5"]
  }
}

data "aws_subnet" "infrastructure_6" {
  vpc_id = data.aws_vpc.default.id
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
  filter {
    name   = "tag:Name"
    values = ["Infrastructure 6"]
  }
}

data "aws_security_group" "default" {
  // Get the default security group for the default vpc
  vpc_id = data.aws_vpc.default.id
  name   = "default"
}