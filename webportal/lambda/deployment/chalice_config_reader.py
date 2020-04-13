import json


def find_deployed_config(resource_type, environment, deployment_path='.chalice/deployed/'):
    with open(f'{deployment_path}{environment}.json') as f:
        deployed_json = json.load(f)

    return next((config for config in deployed_json['resources'] if config['resource_type'] == resource_type), None)


def chalice_config(path='.chalice/config.json'):
    with open(path) as f:
        return json.load(f)
