build:
	go build -o bin/rapidforge .

run:
	./bin/rapidforge

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