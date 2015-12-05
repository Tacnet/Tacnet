# -*- coding: utf-8 -*-
from django.db import models
from south.db import db
from south.utils import datetime_utils as datetime
from south.v2 import SchemaMigration


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Game'
        db.create_table(u'tacsketch_game', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
        ))
        db.send_create_signal(u'tacsketch', ['Game'])

        # Adding model 'GameMode'
        db.create_table(u'tacsketch_gamemode', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('game', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['tacsketch.Game'])),
        ))
        db.send_create_signal(u'tacsketch', ['GameMode'])

        # Adding model 'Map'
        db.create_table(u'tacsketch_map', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('game', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['tacsketch.Game'])),
            ('gameMode', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['tacsketch.GameMode'])),
            ('image', self.gf('django.db.models.fields.files.ImageField')(max_length=100)),
        ))
        db.send_create_signal(u'tacsketch', ['Map'])

        # Adding model 'MapRequest'
        db.create_table(u'tacsketch_maprequest', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('nickname', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('game', self.gf('django.db.models.fields.CharField')(max_length=300)),
            ('map', self.gf('django.db.models.fields.CharField')(max_length=300)),
            ('gameMode', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
            ('imageurl', self.gf('django.db.models.fields.CharField')(max_length=300, blank=True)),
        ))
        db.send_create_signal(u'tacsketch', ['MapRequest'])


    def backwards(self, orm):
        # Deleting model 'Game'
        db.delete_table(u'tacsketch_game')

        # Deleting model 'GameMode'
        db.delete_table(u'tacsketch_gamemode')

        # Deleting model 'Map'
        db.delete_table(u'tacsketch_map')

        # Deleting model 'MapRequest'
        db.delete_table(u'tacsketch_maprequest')


    models = {
        u'tacsketch.game': {
            'Meta': {'object_name': 'Game'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'tacsketch.gamemode': {
            'Meta': {'object_name': 'GameMode'},
            'game': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['tacsketch.Game']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'tacsketch.map': {
            'Meta': {'object_name': 'Map'},
            'game': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['tacsketch.Game']"}),
            'gameMode': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['tacsketch.GameMode']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'tacsketch.maprequest': {
            'Meta': {'object_name': 'MapRequest'},
            'game': ('django.db.models.fields.CharField', [], {'max_length': '300'}),
            'gameMode': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'imageurl': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'}),
            'map': ('django.db.models.fields.CharField', [], {'max_length': '300'}),
            'nickname': ('django.db.models.fields.CharField', [], {'max_length': '300', 'blank': 'True'})
        }
    }

    complete_apps = ['tacsketch']
