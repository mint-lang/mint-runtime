default:
	yarn build && mv bundle.js ../mint/src/assets/runtime.js

build: dc-build
	mv bundle.js ../mint/src/assets/runtime.js

dc-test: dc-install
	docker-compose run --rm runtime yarn test

dc-install:
	docker-compose run --rm runtime yarn

dc-build: dc-install
	docker-compose run --rm runtime yarn build
