#!/bin/sh
# wait-for-it.sh

WAIT_FOR_HOST="$1"
WAIT_FOR_PORT="$2"
shift 2
CMD="$@"

echo "Waiting for $WAIT_FOR_HOST:$WAIT_FOR_PORT to become available..."

while ! nc -z "$WAIT_FOR_HOST" "$WAIT_FOR_PORT"; do
  sleep 1
done

echo "$WAIT_FOR_HOST:$WAIT_FOR_PORT is available. Starting command: $CMD"
exec $CMD

