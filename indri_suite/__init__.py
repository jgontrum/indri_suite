import logging

import yaml

options = yaml.load(open('config/options.yml'))

logging.basicConfig(level=logging.INFO)

# Logging configuration
logger = logging.getLogger('main')
logger.setLevel(logging.INFO)

ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)
formatter = logging.Formatter(
    '%(asctime)s - %(levelname)s - %(message)s')
ch.setFormatter(formatter)
logger.addHandler(ch)
