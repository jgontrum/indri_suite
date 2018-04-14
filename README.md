# Indri Suite

Frontend + Backend to provide a useful interface for Indri.

The API is running at ```http://localhost:8090/api/v1```.
The frontend is running at ```http://localhost:8090/```.

## Requirements

- Python 3.4: [Instructions](https://www.python.org/downloads/)

## Installation

Run ```make``` for a local setup and then ```env/bin/start_debug``` to start the API in debug mode.

To start the service, run ```make start```

If you want to recompile the frontend, make sure you have a recent node version installed and run `make recompile-frontend`.

## Usage
In the frontend, set the absolute paths to the corpus folder, the index folder
and the qrel file to evaluate against. This project is intended to run locally
on the same server where these files are located.

