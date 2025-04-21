#!/bin/sh
# wait-for-it.sh

set -e

host="$1"
port="$2"
shift 2
cmd="$@"

until nc -z "$host" "$port"; do
  >&2 echo "MySQL is not yet available on $host:$port - waiting..."
  sleep 1
done

>&2 echo "MySQL is available on $host:$port - executing command"
exec $cmd