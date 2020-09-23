variable "aws_region" {
  type = string
}

variable "lambda_name" {
    type = string
}

variable "lambda_handler" {
    type = string
}

variable "environment" {
    type = string
}

variable "lambda_binary_bucket" {
    type = string
}

variable "account_number" {
    type = string
}

variable "EXPORT_REQUEST_FOLDER" {
    type = string
}

variable "FILE_EXTENSIONS" {
    type = string
}

variable "tags" {
    type  = map
}

resource "aws_lambda_function" "add_metadata" {
  s3_bucket         = var.lambda_binary_bucket
  s3_key            = "sdc-dot-webportal/add_metadata.zip"
  function_name     = "${var.deploy_env}-${var.lambda_name}"
  role              = aws_iam_role.LambdaRole.arn
  handler           = var.lambda_handler
  source_code_hash  = base64sha256(timestamp()) # Bust cache of deployment... we want a fresh deployment everytime Terraform runs for now...
  runtime           = "python3.7"
  timeout           = 300
  tags              = var.tags
  environment {
    variables = {
      ENVIRONMENT                       = "${var.deploy_env}"
      EXPORT_REQUEST_FOLDER             = "${var.EXPORT_REQUEST_FOLDER}"
      FILE_EXTENSIONS                   = "${var.FILE_EXTENSIONS}"

    }
  }
}


resource "aws_iam_role" "LambdaRole" {
    name = "${var.deploy_env}-${var.lambda_name}"
    assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::${var.account_number}:root",
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
  EOF
}


resource "aws_iam_policy" "LambdaPermissions" {
    name = "${var.deploy_env}-${var.lambda_name}-permissions"
    policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "logs:CreateLogGroup",
      "Resource": "arn:aws:logs:${var.aws_region}:${var.account_number}:*"
    },
    {
      "Effect": "Allow",
      "Action": [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
      ],
      "Resource": [
          "arn:aws:logs:${var.aws_region}:${var.account_number}:log-group:/aws/lambda/${var.deploy_env}-${var.lambda_name}:*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
       "ec2:CreateNetworkInterface",
            "s3:PutObject",
            "s3:GetObject"
      ],
      "Resource": [
        "*"
      ]
    }
  ]
}
  EOF
}

resource "aws_iam_role_policy_attachment" "CloudWatchLogsAttachment" {
  role = aws_iam_role.LambdaRole.name
  policy_arn = aws_iam_policy.LambdaPermissions.arn
}