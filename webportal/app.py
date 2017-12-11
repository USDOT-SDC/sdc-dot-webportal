from chalice import Chalice
import boto3
import json, ast
import logging
from botocore.exceptions import ClientError
from chalice import BadRequestError, NotFoundError, ChaliceViewError, ForbiddenError

TABLENAME = 'roles-to-stack-and-fleet-mapping'

app = Chalice(app_name='webportal')
logger = logging.getLogger()
dynamodb_client = boto3.resource('dynamodb')
appstream_client = boto3.client('appstream')


@app.route('/stacks')
def list_stacks():

    # The following values should be retrieved from Cognito authorizer.
    user_id = "shrivallabh"
    roles = ['role1', 'role2']

    table = dynamodb_client.Table(TABLENAME)

    stack_names=set()
        
    # Extract the stack names associated with the roles passed        
    for role in roles:
        # Get the item with role name
        try:
            response = table.get_item(Key={'role': role })
        except BaseException as be:
            logging.exception("Error: Could not perform get_item() on requested table.Verify requested table exist." + str(be) )
            raise ChaliceViewError("Internal error at server side")                

        # Convert unicode to ascii
        try:                
            formatted_item=ast.literal_eval(json.dumps(response['Item']))
        except KeyError as ke:
            logging.exception("Error: Could not fetch the item for role: " + role)
            raise NotFoundError("Unknown role '%s'" % (role))                            

        # List the stack name
        try:
            for i in formatted_item['mappings']:
                stack_names.add(i['stack_name'])
        except BaseException as be:
            logging.exception("Error:Could not fetch the stacknames for role." + str(be) )
            raise ChaliceViewError("Internal error at server side")                

    return {'stack': list(stack_names)}


@app.route('/streaming-url')
def get_streaming_url():
    params = app.current_request.query_params
    if not params or "stack_name" not in params:
        logger.error("The query parameters 'stack_name' is missing")
        raise BadRequestError("The query parameters 'stack_name' is missing")
    stack_name = params['stack_name']

    # The following values should be retrieved from Cognito authorizer.
    user_id = "shrivallabh"
    roles = ['role1', 'role2']

    # Check if the user has access to the stack.
    found = None

    for role in roles:
        try:
            response = dynamodb_client.get_item(TableName=TABLENAME, key={'role': role})
            if not 'item' in response:
                logging.exception("Error: Could not fetch the item for role: " + role)
                raise ChaliceViewError("Unknown role '%s'" % (role))
            item = response['Item']
            formatted_item = ast.literal_eval(json.dumps(item))
            for mapping in formatted_item['mappings']:
                if mapping['stack_name'] == stack_name:
                    found = mapping
                    break
            if found:
                break
        except KeyError as ke:
            logging.exception("Error: Could not fetch the item for role: " + role)
            raise NotFoundError("Unknown role '%s'" % (role))
        except ClientError as ce:
            logger.exception("Failed to fetch mappings for role: %s".format(role))
            raise ChaliceViewError("Internal error occurred! Contact your administrator.")

    if not found:
        logger.error("Attempt to access forbidden stack with name %s" % stack_name)
        raise ForbiddenError("You do not have access to stack %s" % stack_name)

    # Create the appstream url.
    try:
        response = appstream_client.create_streaming_url(FleetName=found['fleet'], StackName=found['stack'],
                                                         UserId=user_id)
        return {'url': response['StreamingURL']}
    except KeyError as ke:
        logger.exception('received malformed mapping data from dynamodb. %s' % mapping)
        raise ChaliceViewError("Internal error occurred! Contact your administrator.")
    except ClientError as ce:
        logger.exception("Creation of streaming url failed for [user=%s, Fleet=%s, stack=%s]" % (
        user_id, found['fleet'], found['stack']))
        raise ChaliceViewError("Error creating streaming url")


        # {
        #   "role1": [
        #     {
        #       "stack_name": "dot-sdc-default-tools-stack",
        #       "fleet_name": "dot-sdc-default-tools-fleet"
        #     },
        #     {
        #       "stack_name": "dot-sdc-esri-stack",
        #       "fleet_name": "dot-sdc-esri-fleet"
        #     }
        #   ]
        # }
        # See the README documentation for more examples.
        #
