export RF_ENV=development
export RF_LB=false
export RF_KV_URL=rapidforgekv.sqlite3
build:
	go build -o bin/rapidforge .

run:
	./bin/rapidforge

watch:
	air

clean:
	rm -rf bin

# The create-migration command
.PHONY: create-migraton
type ?= sql  # Set the default type to sql if not provided
create-migration:
ifndef name
	$(error name is required. Usage: make create-migration name=migration_name [type=sql|go])
endif
	# echo "Creating migration in ${GOOSE_MIGRATION_DIR} - with type ${type}"; \
    goose --dir database/migrations create ${name} ${type}


.PHONY: docker-build
docker-build:
	@BINARY_NAME=rapidforge \
	DOCKER_IMAGE=rapid_forge \
	DOCKER_TAG=latest \
	DOCKERFILE=Dockerfile \
	PORT=4000 \
	echo "Building Docker image..." && \
	docker build --build-arg PORT=$$PORT -t $$DOCKER_IMAGE:$$DOCKER_TAG -f $$DOCKERFILE .


# BINARY_NAME = rapidforge
# DOCKER_IMAGE = rapid_forge
# DOCKER_TAG = latest
# DOCKERFILE = Dockerfile
# PORT = 8080

# .PHONY: docker-build
# docker-build:
# 	@echo "Building Docker image..."
# 	docker build --build-arg PORT=$(PORT) -t $(DOCKER_IMAGE):$(DOCKER_TAG) -f $(DOCKERFILE) .

.PHONY: build-fe postbuild
npm-build:
	cd sitebuilder && npm run build

build-fe: npm-build
	cp -f sitebuilder/dist/pages.html ./views/page.html
	cp -r sitebuilder/dist/static/* ./static

.PHONY: kill-port
kill-port:
	@echo "Attempting to kill process running on port 4000..."
	@PID=$$(lsof -ti tcp:4000); \
	if [ -n "$$PID" ]; then \
		kill -9 $$PID && echo "Process $$PID killed."; \
	else \
		echo "No process found running on port 4000."; \
	fi

.PHONY: dev
dev:kill-port
	@echo "Starting rapidforge in dev mode..."
	air

.PHONY: release
release:
	goreleaser release --clean