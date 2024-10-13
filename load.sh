#!/bin/bash

# Number of concurrent processes
CONCURRENCY=50

# Number of iterations per process
ITERATIONS=100

# Path to your CLI tool
CLI_PATH="./bin/rapidforge"

# Function to perform operations
perform_operations() {
    for ((i=0; i<$ITERATIONS; i++)); do
        KEY="key_$RANDOM"
        VALUE="value_$RANDOM"

        # Set a key-value pair
        $CLI_PATH set -key "$KEY" -value "$VALUE"

        # Get the value
        $CLI_PATH get -key "$KEY"

        # Delete the key
        $CLI_PATH del -key "$KEY"

        # Optional: Execute a custom SQL query
        # Uncomment the following line to include SQL operations
        # $CLI_PATH sql "INSERT INTO kvstore(key, value) VALUES('$KEY', '$VALUE');"

        # Sleep for a short random duration to simulate real-world usage
        sleep 0.$((RANDOM % 10))
    done
}

# Start time
START_TIME=$(date +%s)

# Run the operations concurrently
for ((c=0; c<$CONCURRENCY; c++)); do
    perform_operations &
done

# Wait for all background processes to finish
wait

# End time
END_TIME=$(date +%s)

# Calculate and display the total time taken
TOTAL_TIME=$((END_TIME - START_TIME))
echo "Load testing completed in $TOTAL_TIME seconds with $CONCURRENCY concurrent processes."
