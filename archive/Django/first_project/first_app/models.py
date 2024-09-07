"""Django models file for the first_app app"""
from django.db import models

# Create your models here.


class Topic(models.Model):
    """Model representing a topic"""

    top_name = models.CharField(max_length=264, unique=True)

    def __str__(self):
        """String representation of the Topic model"""
        return str(self.top_name)


class Webpage(models.Model):
    """Model representing a webpage"""

    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    name = models.CharField(max_length=264, unique=True)
    url = models.URLField(unique=True)

    def __str__(self):
        """String representation of the Webpage model"""
        return str(self.name)


class AccessRecord(models.Model):
    """Model representing an access record"""

    name = models.ForeignKey(Webpage, on_delete=models.CASCADE)
    date = models.DateField()

    def __str__(self):
        """String representation of the AccessRecord model"""
        return str(self.date)
