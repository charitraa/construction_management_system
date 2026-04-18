#!/bin/sh

# Health check script for BuildCMS container
# This script checks if the application is responding

# Check if nginx is running
if ! pgrep -f nginx > /dev/null; then
    echo "Nginx is not running"
    exit 1
fi

# Check if we can access the application
if curl -f http://localhost > /dev/null 2>&1; then
    echo "Application is healthy"
    exit 0
else
    echo "Application is not responding"
    exit 1
fi