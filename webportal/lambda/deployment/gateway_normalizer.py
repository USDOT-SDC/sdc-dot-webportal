import boto3
import json
from . import chalice_config_reader
import os

LOG_FORMAT = "$context.identity.sourceIp $context.identity.caller $context.identity.user [$context.requestTime] \"$context.httpMethod $context.resourcePath $context.protocol\" $context.status $context.responseLength $context.requestId"


def normalize_gateway(environment):
    print(f"Normalizing gateway in {environment}")
    rest_api_config = chalice_config_reader.find_deployed_config('rest_api', environment)
    rest_api_id = rest_api_config['rest_api_id']
    chalice_config = chalice_config_reader.chalice_config()
    stage_name = chalice_config['stages'][environment]['api_gateway_stage']

    gateway_client = api_gateway_client()
    webportal_name = f'{environment}-webportal'
    gateway_client.update_rest_api(restApiId=rest_api_id,
                                   patchOperations=api_gateway_patch_operations(webportal_name))
    
    # For Private APIs, chalice doesn't seem to be assigning VPCE correctly (although it generates a valid policy)
    gateway_type = chalice_config['stages'][environment].get('api_gateway_endpoint_type', "NOT_PRIVATE")
    print(f"Gateway type for {environment} is {gateway_type}")
    if gateway_type == "PRIVATE":
        vpce = chalice_config['stages'][environment]['api_gateway_endpoint_vpce']
        print(f"Explicitly adding {vpce} to private endpoint")
        gateway_client.update_rest_api(restApiId=rest_api_id,
                                       patchOperations=[{'op': 'add', 'path': '/endpointConfiguration/vpcEndpointIds', 'value': vpce}])

    gateway_client.update_stage(restApiId=rest_api_id, stageName=stage_name,
                                patchOperations=stage_patch_operations(rest_api_id, stage_name))
    gateway_client.tag_resource(resourceArn=f'arn:aws:apigateway:{get_region()}::/restapis/{rest_api_id}',
                                tags={"Environment": environment, "Project": "SDC-Platform", "Team": "sdc-platform"})


def api_gateway_patch_operations(webportal_name):
    return [{'op': 'replace', 'path': '/name', 'value': webportal_name},
            {'op': 'replace', 'path': '/description', 'value': webportal_name},
            ]


def stage_patch_operations(rest_api_id, stage_name):
    return [{'op': 'replace', 'path': '/accessLogSettings/destinationArn',
             'value': get_log_setting_destination_arn(rest_api_id, stage_name)},
            {'op': 'replace', 'path': '/accessLogSettings/format', 'value': LOG_FORMAT}]


def get_log_setting_destination_arn(rest_api_id, stage_name):
    return f'arn:aws:logs:{get_region()}:{get_account_number()}:log-group:/aws/apigateway/{rest_api_id}/{stage_name}'


def get_region():
    return get_session().region_name


def api_gateway_client():
    session = get_session()
    return session.client('apigateway')


def get_account_number():
    session = get_session()
    return session.client('sts').get_caller_identity().get('Account')


def get_session():
    on_dot_rhel = os.path.isfile('/proc/sys/crypto/fips_enabled')
    if on_dot_rhel:
        return boto3.Session()
    else:
        return boto3.Session(profile_name='sdc')