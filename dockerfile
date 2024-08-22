# Step 1: Use the official Golang 1.22 image to build the binary
FROM golang:1.22 AS builder

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy go.mod and go.sum files
COPY go.mod go.sum ./

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download

# Copy the rest of the application code
COPY . .

# Build the binary using the Makefile
RUN make build

# Step 2: Use Debian as the base image for the final container
FROM debian:latest

# Install necessary packages: CA certificates, curl, and jq
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    jq \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy the binary from the builder stage
COPY --from=builder /app/bin/rapidforge .

# Define a build argument for the port
ARG PORT=8080
ENV RF_PORT=$PORT
# Expose the application port using the argument
EXPOSE ${PORT}

# Command to run the binary
CMD ["./rapidforge"]
