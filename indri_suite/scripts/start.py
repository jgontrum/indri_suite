from indri_suite.app import app


def run(debug=False):
    app.run(port=8081, debug=debug, server='flask', host="localhost")


def run_debug():
    run(debug=True)
