const graphql = require('graphql');

const queryType = new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
        hello: {
            description: "Hello everybody",
            type: graphql.GraphQLString,
            resolve() {
                return 'world';
            }
        }
    }
});

const schema = new graphql.GraphQLSchema({query: queryType});

module.exports = schema;