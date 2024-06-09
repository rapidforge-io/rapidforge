build:
	go build -o bin/rapidforge main.go

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