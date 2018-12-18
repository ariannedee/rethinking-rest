import graphene


class Query(graphene.ObjectType):
    hello = graphene.String(description='hello')

    def resolve_hello(self, info):
        return 'world'

schema = graphene.Schema(query=Query)