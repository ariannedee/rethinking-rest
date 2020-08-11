import graphene

class Query(graphene.ObjectType):
    hello = graphene.String(description='Hello world')

    def resolve_hello(self, info):
        return 'world'

schema = graphene.Schema(query=Query)
