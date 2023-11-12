data "archive_file" "add_metadata" {
  type        = "zip"
  source_file = "${path.module}./add-metadata-to-s3-object/add_metadata.py"
  output_path = "${path.module}./add-metadata-to-s3-object/deployment-package.zip"
}

resource "aws_lambda_function" "add_metadata" {
  function_name    = "${local.environment}-${var.lambda_name}"
  filename         = data.archive_file.add_metadata.output_path
  source_code_hash = data.archive_file.add_metadata.output_base64sha256
  role             = aws_iam_role.LambdaRole.arn
  handler          = "add_metadata.lambda_handler"
  runtime          = "python3.11"
  timeout          = 300
  tags             = local.global_tags
  environment {
    variables = {
      ENVIRONMENT           = "${local.environment}"
      EXPORT_REQUEST_FOLDER = "${var.EXPORT_REQUEST_FOLDER}"
    }
  }
}

resource "aws_iam_role" "LambdaRole" {
  name = "${local.environment}-${var.lambda_name}"
  assume_role_policy = jsonencode(
    {
      "Version" : "2012-10-17",
      "Statement" : [
        {
          "Effect" : "Allow",
          "Principal" : {
            "AWS" : "arn:aws:iam::${local.account_id}:root",
            "Service" : "lambda.amazonaws.com"
          },
          "Action" : "sts:AssumeRole"
        }
      ]
    }
  )
}

data "aws_s3_bucket" "lambda_trigger_buckets" {
  count  = length(local.lambda_trigger_buckets)
  bucket = local.lambda_trigger_buckets[count.index]
}

data "aws_iam_policy_document" "policy_doc" {
  statement {
    effect = "Allow"

    actions = [
      "logs:CreateLogGroup"
    ]

    resources = [
      "arn:aws:logs:${local.region_name}:${local.account_id}:*"
    ]
  }

  statement {
    effect = "Allow"

    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]

    resources = [
      "arn:aws:logs:${local.region_name}:${local.account_id}:log-group:/aws/lambda/${local.environment}-${var.lambda_name}:*"
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
      for id in local.lambda_trigger_buckets[*] :
      "arn:aws:s3:::${id}/*"
    ]
  }
}

resource "aws_iam_policy" "LambdaPermissions" {
  name   = "${local.environment}-${var.lambda_name}-permissions"
  policy = data.aws_iam_policy_document.policy_doc.json
  tags   = local.iam_policy_tags
}

resource "aws_iam_role_policy_attachment" "CloudWatchLogsAttachment" {
  role       = aws_iam_role.LambdaRole.name
  policy_arn = aws_iam_policy.LambdaPermissions.arn
}

resource "aws_lambda_permission" "allow_lambda_trigger_buckets" {
  count         = length(local.lambda_trigger_buckets)
  statement_id  = "AllowExecutionFromS3Bucket-${count.index}"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.add_metadata.arn
  principal     = "s3.amazonaws.com"
  source_arn    = data.aws_s3_bucket.lambda_trigger_buckets[count.index].arn
}

