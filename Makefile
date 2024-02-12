server:
	cd ./apps/server && make run

web:
	cd ./apps/web && pnpm dev

build:
	cd ./apps/server && make build
	cd ./apps/web && pnpm build