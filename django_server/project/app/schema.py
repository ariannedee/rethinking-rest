
class QueryType(graphene.ObjectType):
    users = graphene.List(UserType)
    books = graphene.List(BookType, fiction=graphene.Boolean())

    def resolve_users(self, info):
        return UserModel.objects.all()

    def resolve_books(self, info, **kwargs):
        q = Book.objects.all()
        if 'fiction' in kwargs:
            q = q.filter(fiction=kwargs['fiction'])
        return q


schema = graphene.Schema(query=QueryType)