from deployment import chalice_config_reader


def test_find_deployed_config_returns_config_block():
    resource_type = 'some_resource_type'
    environment = 'some_environment'

    result = chalice_config_reader.find_deployed_config(resource_type, environment, deployment_path='tests/fixtures/')

    assert result['rest_api_id'] == 'some_rest_api_id'


def test_find_deployed_config_does_not_blow_up_if_config_not_found():
    resource_type = 'not_found'
    environment = 'some_environment'

    chalice_config_reader.find_deployed_config(resource_type, environment, deployment_path='tests/fixtures/')



def test_chalice_config_returns_json_dict():
    result = chalice_config_reader.chalice_config('tests/fixtures/some_config.json')

    assert result["backend"] == "api"