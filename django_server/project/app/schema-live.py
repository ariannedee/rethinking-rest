import graphene
import graphene_django
from django.contrib.auth.backends import UserModel


class UserType(graphene_django.DjangoObjectType):
    is_admin = graphene.Boolean()

    def resolve_is_admin(self, info):
        return self.is_staff
        
    class Meta:
        model = UserModel
        only_fields = ('id', 'username')


class Query(graphene.ObjectType):
    users = graphene.List(UserType)

    def resolve_users(self, info):
        return UserModel.objects.all()

schema = graphene.Schema(query=Query)
