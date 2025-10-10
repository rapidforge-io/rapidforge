#!/bin/bash

# after you download you can use this optional script to start / stop the service
# RapidForge Startup Script
# This script manages RapidForge (start/stop/restart/update)
# rapidforge binary itself does the update

set -e

APP_NAME="rapidforge"
INSTALL_DIR="$(cd "$(dirname "$0")" && pwd)"
PID_FILE="/tmp/rapidforge.pid"
LOG_FILE="$INSTALL_DIR/rapidforge.log"

is_running() {
    if [ -f "$PID_FILE" ]; then
        local pid=$(cat "$PID_FILE")
        if ps -p "$pid" > /dev/null 2>&1; then
            return 0
        else
            rm -f "$PID_FILE"
        fi
    fi
    return 1
}

stop() {
    if [ ! -f "$PID_FILE" ]; then
        echo "$APP_NAME is not running"
        return
    fi

    local pid=$(cat "$PID_FILE")

    if ! ps -p "$pid" > /dev/null 2>&1; then
        echo "$APP_NAME is not running (stale PID file)"
        rm -f "$PID_FILE"
        return
    fi

    echo "Stopping $APP_NAME (PID: $pid)..."
    kill -TERM "$pid" 2>/dev/null || true

    # Wait for graceful shutdown (max 30 seconds)
    local count=0
    while [ $count -lt 30 ] && ps -p "$pid" > /dev/null 2>&1; do
        sleep 1
        count=$((count + 1))
        echo -n "."
    done
    echo ""

    # Force kill if still running
    if ps -p "$pid" > /dev/null 2>&1; then
        echo "Force stopping..."
        kill -9 "$pid" 2>/dev/null || true
    fi

    rm -f "$PID_FILE"
    echo "$APP_NAME stopped"
}

start() {
    if is_running; then
        echo "$APP_NAME is already running (PID: $(cat $PID_FILE))"
        exit 1
    fi

    echo "Starting $APP_NAME..."

    cd "$INSTALL_DIR"

    nohup "./$APP_NAME" > "$LOG_FILE" 2>&1 &
    local pid=$!
    echo $pid > "$PID_FILE"

    sleep 1

    if ps -p $pid > /dev/null 2>&1; then
        echo "$APP_NAME started successfully (PID: $pid)"
        echo "Log file: $LOG_FILE"
    else
        echo "Failed to start $APP_NAME"
        echo "Check log file: $LOG_FILE"
        rm -f "$PID_FILE"
        exit 1
    fi
}

restart() {
    stop
    sleep 2
    start
}

status() {
    if is_running; then
        local pid=$(cat "$PID_FILE")
        echo "$APP_NAME is running (PID: $pid)"

        if command -v ps &> /dev/null; then
            ps -p $pid -o pid,pcpu,pmem,etime,cmd 2>/dev/null || true
        fi
    else
        echo "$APP_NAME is not running"
    fi
}

update() {
    cd "$INSTALL_DIR"

    echo "=== RapidForge Update ==="

    if [ ! -f "./$APP_NAME" ]; then
        echo "Error: $APP_NAME binary not found in $INSTALL_DIR"
        exit 1
    fi

    WAS_RUNNING=false
    if is_running; then
        WAS_RUNNING=true
        echo "$APP_NAME is running, stopping it for update..."
        stop
        sleep 2
    fi

    echo "Using built-in update mechanism..."
    if "./$APP_NAME" update --force; then
        echo "Update completed successfully using built-in updater"

        if [ "$WAS_RUNNING" = true ]; then
            echo "Restarting $APP_NAME..."
            start
        fi

        return 0
    else
        echo "Built-in update failed or not available"
        return 1
    fi
}

usage() {
    echo "Usage: $0 {start|stop|restart|status|update}"
    echo ""
    echo "Commands:"
    echo "  start    - Start RapidForge in background"
    echo "  stop     - Stop RapidForge gracefully"
    echo "  restart  - Restart RapidForge"
    echo "  status   - Check if RapidForge is running"
    echo "  update   - Update RapidForge to latest version"
    exit 1
}

case "${1:-start}" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    status)
        status
        ;;
    update)
        update
        ;;
    *)
        usage
        ;;
esac
