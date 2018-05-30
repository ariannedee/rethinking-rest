from django.contrib.auth.backends import UserModel
from django.db import models


class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=200)
    fiction = models.BooleanField()
    published_year = models.IntegerField()


class HasRead(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name='has_read')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='read_by')
    rating = models.IntegerField(null=True)

    class Meta:
        unique_together = (('user', 'book'),)