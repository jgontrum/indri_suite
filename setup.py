from setuptools import setup

setup(
    name='indri_suite',
    version='0.1',
    description='Frontend + Backend to provide a useful interface for Indri.',
    author='Johannes Gontrum',
    author_email='gontrum@me.com',
    include_package_data=True,
    license='MIT license',
    entry_points={
          'console_scripts': [
              'start = indri_suite.scripts.start:run',
              'start_debug = indri_suite.scripts.start:run_debug'
          ]
      }
)
