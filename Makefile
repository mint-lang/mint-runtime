default:
	yarn build && mv build/bundle.js ../mint/src/assets/runtime.js

build: dc-build
	mv build/bundle.js ../mint/src/assets/runtime.js

dc-test: dc-install
	docker-compose run --rm runtime yarn test

dc-format: dc-install
	docker-compose run --rm runtime yarn format

dc-install:
	docker-compose run --rm runtime yarn install

dc-build: dc-install
	docker-compose run --rm runtime yarn build

dc-upgrade:
	docker-compose run --rm runtime yarn upgrade
