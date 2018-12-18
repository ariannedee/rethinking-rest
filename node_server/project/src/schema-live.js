const graphql = require('graphql');

const queryType = new graphql.GraphQLObjectType({
    name: 'Query',
    description: "I'm a description",
    fields: {
        hello: {
            description: "hello",
            type: graphql.GraphQLString,
            resolve () {
                return 'world';
            }
        }
    }
});

const schema = new graphql.GraphQLSchema({query: queryType});

module.exports = schema;