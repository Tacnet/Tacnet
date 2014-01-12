[program:tacnet-test]
directory = /home/tacnet-www/test/scripts/server/
user = tacnet-www
command = /home/tacnet-www/test/scripts/server/unicorn-test.sh
stdout_logfile = /home/tacnet-www/test/logs/supervisor.log
stderr_logfile = /home/tacnet-www/test/logs/supervisor_error.log

