import graphene

class QueryType(graphene.ObjectType):
    hello = graphene.String(description="Hello world!")

    def resolve_hello(self, info):
        return "world"

    class Meta:
        description = "Query object"


schema = graphene.Schema(query=QueryType)