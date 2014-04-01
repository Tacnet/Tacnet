# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Subscriber'
        db.create_table(u'mailinglist_subscriber', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('mail', self.gf('django.db.models.fields.EmailField')(unique=True, max_length=75)),
            ('received_letters', self.gf('django.db.models.fields.IntegerField')(default=0, max_length=1000)),
            ('register_date', self.gf('django.db.models.fields.DateField')(default=datetime.datetime(2013, 12, 20, 0, 0))),
        ))
        db.send_create_signal(u'mailinglist', ['Subscriber'])

        # Adding model 'Letter'
        db.create_table(u'mailinglist_letter', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('publish_date', self.gf('django.db.models.fields.DateTimeField')(default=datetime.datetime(2013, 12, 20, 0, 0))),
            ('content', self.gf('django.db.models.fields.TextField')()),
        ))
        db.send_create_signal(u'mailinglist', ['Letter'])


    def backwards(self, orm):
        # Deleting model 'Subscriber'
        db.delete_table(u'mailinglist_subscriber')

        # Deleting model 'Letter'
        db.delete_table(u'mailinglist_letter')


    models = {
        u'mailinglist.letter': {
            'Meta': {'object_name': 'Letter'},
            'content': ('django.db.models.fields.TextField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'publish_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime(2013, 12, 20, 0, 0)'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '200'})
        },
        u'mailinglist.subscriber': {
            'Meta': {'object_name': 'Subscriber'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'mail': ('django.db.models.fields.EmailField', [], {'unique': 'True', 'max_length': '75'}),
            'received_letters': ('django.db.models.fields.IntegerField', [], {'default': '0', 'max_length': '1000'}),
            'register_date': ('django.db.models.fields.DateField', [], {'default': 'datetime.datetime(2013, 12, 20, 0, 0)'})
        }
    }

    complete_apps = ['mailinglist']