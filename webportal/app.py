from chalice import Chalice
import boto3
import json, ast
import logging
from chalice import BadRequestError
from chalice import NotFoundError
from chalice import ChaliceViewError

from boto3.dynamodb.conditions import Key, Attr

app = Chalice(app_name='webportal')
logger = logging.getLogger()

@app.route('/stacks')
def list_stacks():

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('roles-to-stack-and-fleet-mapping')
    
    try:
    # Get the role names passed in the request
        roles_raw = app.current_request.query_params['role']
        roles = roles_raw.split(",")
        if not roles:
            raise Exception()
    except BaseException as ve:
        logging.exception("Error: Verify role names are passed")
        raise BadRequestError("Role name not passed")

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
 