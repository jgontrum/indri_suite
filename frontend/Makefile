.PHONY: install start clean build

node_modules/:
	npm install
	npm install @angular/cli

start: node_modules/
	./node_modules/\@angular/cli/bin/ng serve --open --proxy-config proxy.conf.json

clean:
	rm -rfv node_modules tmp dist out-tsc .sass-cache connect.lock coverage libpeerconnection.log npm-debug.log testem.log typings
	rm -rfv e2e/*.js
	rm -rfv e2e/*.map
	find . -name '*.DS_Store' -exec rm -fv {} \;

build:
	npm install
	npm install @angular/cli
	./node_modules/\@angular/cli/bin/ng build --prod --aot

install: node_modules
