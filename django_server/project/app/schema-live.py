import graphene

class Query(graphene.ObjectType):
    hello = graphene.String(description="Hello everyone")

    def resolve_hello(self, info):
        return 'World'

schema = graphene.Schema(query=Query)