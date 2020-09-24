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

resource "aws_lambda_function" "add_metadata" {
  s3_bucket         = var.lambda_binary_bucket
  s3_key            = "sdc-dot-webportal/add_metadata.zip"
  function_name     = "${var.deploy_env}-${var.lambda_name}"
  role              = aws_iam_role.LambdaRole.arn
  handler           = "add_metadata.lambda_handler"
  source_code_hash  = base64sha256(timestamp()) # Bust cache of deployment... we want a fresh deployment everytime Terraform runs for now...
  runtime           = "python3.7"
  timeout           = 300
  tags              = local.global_tags
  environment {
    variables = {
      ENVIRONMENT                       = "${var.deploy_env}"
      EXPORT_REQUEST_FOLDER             = "${var.EXPORT_REQUEST_FOLDER}"
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

data "aws_s3_bucket" "lambda_trigger_buckets" {
  count   = length(var.lambda_trigger_buckets)
  bucket  = var.lambda_trigger_buckets[count.index]
}

resource "aws_iam_policy" "LambdaPermissions" {
    count   = length(var.lambda_trigger_buckets)
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
        "s3:GetObject",
        "s3:PutObject",
        "s3:GetObjectTagging",
        "s3:PutObjectTagging"
      ],
      "Resource": ["arn:aws:s3:::${data.aws_s3_bucket.lambda_trigger_buckets[count.index].bucket}/*", 
                   "arn:aws:s3:::${data.aws_s3_bucket.lambda_trigger_buckets[count.index].bucket}"]
    }
  ]
}
  EOF
}

resource "aws_iam_role_policy_attachment" "CloudWatchLogsAttachment" {
  count = length(var.lambda_trigger_buckets)
  role = aws_iam_role.LambdaRole.name
  policy_arn = aws_iam_policy.LambdaPermissions[count.index].arn
}

resource "aws_lambda_permission" "allow_lambda_trigger_buckets" {
  count         = length(var.lambda_trigger_buckets)
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.add_metadata.arn
  principal     = "s3.amazonaws.com"
  source_arn    = data.aws_s3_bucket.lambda_trigger_buckets[count.index].arn
}

resource "aws_s3_bucket_notification" "lambda_trigger_buckets_notification" {
    count  = length(var.lambda_trigger_buckets)
    bucket = var.lambda_trigger_buckets[count.index]

    lambda_function {
        lambda_function_arn = aws_lambda_function.add_metadata.arn
        events              = ["s3:ObjectCreated:Put", "s3:ObjectCreated:CompleteMultipartUpload"]
    }

    depends_on = [aws_lambda_permission.allow_lambda_trigger_buckets]
}