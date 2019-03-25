import graphene
import graphene_django
from django.contrib.auth.backends import UserModel
from django.db.models import Avg

from .models import Book, HasRead, read_book


class UserType(graphene_django.DjangoObjectType):
    is_staff = graphene.Boolean(name='isAdmin')
    average_rating = graphene.Float()

    def resolve_average_rating(self, info):
        query = self.books_read.all().aggregate(Avg('rating'))
        return query['rating__avg']

    class Meta:
        model = UserModel
        only_fields = ('id', 'username', 'books_read')


class BookType(graphene_django.DjangoObjectType):
    average_rating = graphene.Float()

    def resolve_average_rating(self, info):
        query = self.read_by.all().aggregate(Avg('rating'))
        return query['rating__avg']

    class Meta:
        model = Book


class HasReadType(graphene_django.DjangoObjectType):
    class Meta:
        model = HasRead

pagination_args = {
    'first': graphene.Int(default_value=10),
    'offset': graphene.Int()
}

class Query(graphene.ObjectType):
    users = graphene.List(UserType, **pagination_args)
    user = graphene.Field(UserType, id=graphene.Int(required=True))
    books = graphene.List(BookType, fiction=graphene.Boolean(), **pagination_args)
    book = graphene.Field(BookType, id=graphene.Int(required=True))

    def resolve_users(self, info, **kwargs):
        q = UserModel.objects.all()

        start = 0
        end = None
        if 'offset' in kwargs:
            start = kwargs.get('offset')
        if 'first' in kwargs:
            end = start + kwargs.get('first')
        return q[start:end]

    def resolve_books(self, info, **kwargs):
        fiction = kwargs.get('fiction')

        q = Book.objects.all()
        if fiction is not None:
            q = q.filter(fiction=fiction)

        start = 0
        end = None
        if 'offset' in kwargs:
            start = kwargs.get('offset')
        if 'first' in kwargs:
            end = start + kwargs.get('first')
        return q[start:end]

    def resolve_user(self, info, **kwargs):
        return UserModel.objects.get(id=kwargs['id'])

    def resolve_book(self, info, **kwargs):
        return Book.objects.get(id=kwargs['id'])


class ReadBook(graphene.Mutation):
    class Arguments:
        book = graphene.Int(required=True)
        user = graphene.Int(required=True)
        rating = graphene.Int()
    
    hasRead = graphene.Field(HasReadType)

    def mutate(self, info, **kwargs):
        book_id = kwargs['book']
        user_id = kwargs['user']
        rating = kwargs.get('rating')

        hasRead = read_book(book_id, user_id, rating)
        return ReadBook(hasRead=hasRead)


class Mutations(graphene.ObjectType):
    read_book = ReadBook.Field()

schema = graphene.Schema(query=Query, mutation=Mutations)
