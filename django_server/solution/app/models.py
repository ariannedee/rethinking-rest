from django.contrib.auth.backends import UserModel
from django.db import models


class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=200)
    fiction = models.BooleanField()
    published_year = models.IntegerField()


class HasRead(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name='books_read')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='read_by')
    rating = models.IntegerField(null=True)

    class Meta:
        unique_together = (('user', 'book'),)


def read_book(book_id, user_id, rating):
    try:
        book = Book.objects.get(id=book_id)
    except:
        ok = False
        raise Exception(f'Book with id {book_id} doesn\'t exist')
    try:
        user = UserModel.objects.get(id=user_id)
    except:
        raise Exception(f'User with id {user_id} doesn\'t exist')

    if rating < 0 or rating > 10:
        raise Exception(f'Rating must be between 0 and 10')

    hasRead, created = HasRead.objects.get_or_create(user=user, book=book)
    hasRead.rating = rating
    hasRead.save()
    return hasRead
