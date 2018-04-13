from indri_suite_test.integration import post_json


def test_foo_post():
    request = {
        "data": "TEST"
    }

    response, status = post_json(f"/foo", request)

    assert status == 200
    assert isinstance(response, dict)
    assert response['returnData'] == "TEST"
