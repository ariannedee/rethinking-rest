import graphene

class Query(graphene.ObjectType):
    hello = graphene.String(description="hello world field")

    def resolve_hello(self, info):
        return 'world'


schema = graphene.Schema(query=Query)
