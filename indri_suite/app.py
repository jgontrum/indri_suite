import connexion

app = connexion.App("Indri Suite API", specification_dir='config/')
app.add_api("api.yml",
            strict_validation=True,
            validate_responses=True)

application = app.app

if __name__ == '__main__':
    app.run(port=8080, server='flask', host="localhost", static_folder="static")
