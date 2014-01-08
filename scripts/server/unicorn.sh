#!/bin/bash
set -e
LOGFILE=/home/tacnet-www/www/logs/unicorn.log
LOGDIR=$(dirname $LOGFILE)
NUM_WORKERS=5
USER=tacnet-www
GROUP=tacnet-www
ADDRESS=127.0.0.1:1341
cd /home/tacnet-www/www/tacnet/
source /home/tacnet-www/www/venv/bin/activate
test -d $LOGDIR || mkdir -p $LOGDI

export NEW_RELIC_CONFIG_FILE=/home/tacnet-www/www/scripts/server/newrelic.ini
exec newrelic-admin run-program gunicorn tacnet.wsgi:application -w $NUM_WORKERS --bind=$ADDRESS \
  --user=$USER --group=$GROUP --log-level=debug \
  --log-file=$LOGFILE 2>>$LOGFILE


#exec gunicorn tacnet.wsgi:application -w $NUM_WORKERS --bind=$ADDRESS \
#  --user=$USER --group=$GROUP --log-level=debug \
#  --log-file=$LOGFILE 2>>$LOGFILE
