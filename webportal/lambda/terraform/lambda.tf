data "archive_file" "lambda_zip" {
    type        = "zip"
    source_dir  = "../src"
    output_path = "zip/lambda.zip"
}

resource "aws_lambda_function" "webportal_lambda" {
    filename = "zip/lambda.zip"
    function_name = "webportal-ecs-${local.environment}"
    source_code_hash = filebase64sha256("zip/lambda.zip")
    role = aws_iam_role.webportal_lambda_role.arn
    handler = "app.app"
    timeout = 60
    runtime = "python3.8"
    environment {
      variables = {
        LOG_LEVEL = local.log_level

        AUTHORIZERID = local.AUTHORIZERID
        COGNITO_USER_POOL = local.COGNITO_USER_POOL
        IDP_PROVIDER_ARNS = local.IDP_PROVIDER_ARNS
        RECEIVER_EMAIL = local.RECEIVER_EMAIL
        RESTAPIID = local.RESTAPIID
        TABLENAME_AUTOEXPORT_USERS = local.TABLENAME_AUTOEXPORT_USERS
        TABLENAME_AVAILABLE_DATASET = local.TABLENAME_AVAILABLE_DATASET
        TABLENAME_EXPORT_FILE_REQUEST = local.TABLENAME_EXPORT_FILE_REQUEST
        TABLENAME_MANAGE_DISK = local.TABLENAME_MANAGE_DISK
        TABLENAME_MANAGE_DISK_INDEX = local.TABLENAME_MANAGE_DISK_INDEX
        TABLENAME_MANAGE_UPTIME = local.TABLENAME_MANAGE_UPTIME
        TABLENAME_MANAGE_UPTIME_INDEX = local.TABLENAME_MANAGE_UPTIME_INDEX
        TABLENAME_MANAGE_USER = local.TABLENAME_MANAGE_USER
        TABLENAME_MANAGE_USER_INDEX = local.TABLENAME_MANAGE_USER_INDEX
        TABLENAME_TRUSTED_USERS = local.TABLENAME_TRUSTED_USERS
        TABLENAME_USER_STACKS = local.TABLENAME_USER_STACKS

      }
    }
    tags = local.lambda_tags
}

resource "aws_iam_role" "webportal_lambda_role" {
    name = "webportal-ecs-${local.environment}-api_handler"
    assume_role_policy = file("assume_role_policy.json")
    tags = local.global_tags
}

resource "aws_iam_role_policy" "webportal_lambda_policy" {
    name = "webportal-ecs-${local.environment}-api_handler"
    role = aws_iam_role.webportal_lambda_role.id
    policy = file("webportal_lambda_policy.json")
}


