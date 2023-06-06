import graphene

import graphene_django
from django.contrib.auth.backends import UserModel
from .models import Book, HasRead


class UserType(graphene_django.DjangoObjectType):
    is_admin = graphene.Boolean()

    def resolve_is_admin(self, info):
        return self.is_staff

    class Meta:
        model = UserModel
        only_fields = ('id', 'username', 'books_read')


class BookType(graphene_django.DjangoObjectType):
    is_fiction = graphene.Boolean()

    def resolve_is_fiction(self, info):
        return self.fiction

    class Meta:
        model = Book
        exclude_fields = ('fiction', )


class HasReadType(graphene_django.DjangoObjectType):
    class Meta:
        model = HasRead


class QueryType(graphene.ObjectType):
    users = graphene.List(UserType)
    books = graphene.List(BookType)

    def resolve_users(self, info):
        return UserModel.objects.all()
    
    def resolve_books(self, info):
        return Book.objects.all()
    

schema = graphene.Schema(query=QueryType)
