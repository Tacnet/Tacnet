setup: development

development:
	virtualenv venv
	venv/bin/pip install -r requirements.txt
	echo "from development import *" > system/settings/local.py
	export DJANGO_SETTINGS_MODULE=settings

	venv/bin/python system/manage.py collectstatic --noinput --clear
	venv/bin/python system/manage.py syncdb --migrate

production:
	venv/bin/pip install -r requirements.txt
	venv/bin/pip install psycopg2 python-memcached newrelic
	echo "from production import *" > system/settings/local.py
	export DJANGO_SETTINGS_MODULE=settings

	venv/bin/python system/manage.py collectstatic --noinput --clear
	venv/bin/python system/manage.py syncdb --migrate

use:
	source venv/bin/activate

update:
	git fetch && git reset --hard origin/master
	venv/bin/pip install -r requirements.txt
	export DJANGO_SETTINGS_MODULE=settings

	venv/bin/python system/manage.py collectstatic --noinput --clear
	venv/bin/python system/manage.py syncdb --migrate
