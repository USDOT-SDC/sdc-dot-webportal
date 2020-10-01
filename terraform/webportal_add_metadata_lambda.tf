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

data "aws_iam_policy_document" "policy_doc" {
  statement {
    effect = "Allow"

    actions = [
      "logs:CreateLogGroup"
    ]

    resources = [
      "arn:aws:logs:${var.aws_region}:${var.account_number}:*"
    ]
  }

  statement {
    effect = "Allow"

    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]

    resources = [
      "arn:aws:logs:${var.aws_region}:${var.account_number}:log-group:/aws/lambda/${var.deploy_env}-${var.lambda_name}:*"
    ]
  }

  statement {
    effect = "Allow"

    actions = [
      "kms:*"
    ]

    resources = [
      "*"
    ]
  }

  statement {
     effect = "Allow"

    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:GetObjectTagging",
      "s3:PutObjectTagging"
    ]

    resources = [
      for id in var.lambda_trigger_buckets[*]:
        "arn:aws:s3:::${id}/*"
    ]   
  }
}

resource "aws_iam_policy" "LambdaPermissions" {
    name    = "${var.deploy_env}-${var.lambda_name}-permissions"
    policy  = "${data.aws_iam_policy_document.policy_doc.json}"
}

resource "aws_iam_role_policy_attachment" "CloudWatchLogsAttachment" {
  role = aws_iam_role.LambdaRole.name
  policy_arn = aws_iam_policy.LambdaPermissions.arn
}

resource "aws_lambda_permission" "allow_lambda_trigger_buckets" {
  count         = length(var.lambda_trigger_buckets)
  statement_id  = "AllowExecutionFromS3Bucket-${count.index}"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.add_metadata.arn
  principal     = "s3.amazonaws.com"
  source_arn    = data.aws_s3_bucket.lambda_trigger_buckets[count.index].arn
}

