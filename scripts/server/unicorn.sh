#!/bin/bash
set -e
LOGFILE=/home/tacnet-web/www/logs/unicorn.log
LOGDIR=$(dirname $LOGFILE)
NUM_WORKERS=5
USER=tacnet-web
GROUP=tacnet-web
ADDRESS=127.0.0.1:9002
cd /home/tacnet-web/www/tacnet/
source /home/tacnet-web/www/venv/bin/activate
test -d $LOGDIR || mkdir -p $LOGDI
#export NEW_RELIC_CONFIG_FILE=/home/tacnet-web/www/scripts/server/newrelic.ini
#exec newrelic-admin run-program gunicorn tacnet.wsgi:application -w $NUM_WORKERS --bind=$ADDRESS \
#  --user=$USER --group=$GROUP --log-level=debug \
#  --log-file=$LOGFILE 2>>$LOGFILE
exec gunicorn tacnet.wsgi:application -w $NUM_WORKERS --bind=$ADDRESS \
  --user=$USER --group=$GROUP --log-level=debug \
  --log-file=$LOGFILE 2>>$LOGFILE
