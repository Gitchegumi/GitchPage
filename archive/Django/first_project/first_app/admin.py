"""This is the admin.py file for the first_app app."""
from first_app.models import AccessRecord, Topic, Webpage

from django.contrib import admin

# Register your models here.

admin.site.register(AccessRecord)
admin.site.register(Topic)
admin.site.register(Webpage)
