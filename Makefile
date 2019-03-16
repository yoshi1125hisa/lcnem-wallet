
install:
	@cd angular &&\
	npm ci

build:
	@cd angular &&\
	ng build --prod

start:
	@cd angular &&\
	ng serve

test:
	@cd angular &&\
	npm run test --watch=false

test/ci:
	@cd angular &&\
	npm run test -- --no-watch --no-progress --browsers=ChromeHeadlessCI

e2e:
	@cd angular &&\
	npm run e2e

e2e/ci:
	@cd angular &&\
	npm run e2e -- --protractor-config=e2e/protractor-ci.conf.js

deploy/angular: build
	@cd firebase &&\
	firebase deploy --only hosting

deploy/angular/ci: build
	@which firebase || npm install -g firebase-tools
	@cd firebase &&\
	firebase deploy --only hosting --token $(FIREBASE_TOKEN)
