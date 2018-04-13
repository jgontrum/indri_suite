.PHONY: clean start update-all-packages

all: env/bin/python

env/bin/python:
	python3.4 -m venv env
	env/bin/pip install --upgrade pip
	env/bin/pip install wheel
	env/bin/pip install -r requirements.txt
	env/bin/python setup.py develop

clean:
	rm -rfv bin develop-eggs dist downloads eggs env parts
	rm -fv .DS_Store .coverage .installed.cfg bootstrap.py
	rm -fv logs/*.txt
	find . -name '*.pyc' -exec rm -fv {} \;
	find . -name '*.pyo' -exec rm -fv {} \;
	find . -depth -name '*.egg-info' -exec rm -rfv {} \;
	find . -depth -name '__pycache__' -exec rm -rfv {} \;

start: env/bin/python
	env/bin/uwsgi --yaml=config/uwsgi.yml

update-all-packages: env/bin/python
	 env/bin/pip freeze --local | grep -v '^\-e' | cut -d = -f 1  | xargs -n1 env/bin/pip install -U

test: env/bin/python
	env/bin/py.test --cov=indri_suite indri_suite_test -vv
