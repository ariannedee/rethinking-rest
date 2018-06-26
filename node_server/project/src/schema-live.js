var graphql = require('graphql');

var queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    hello: {
      type: graphql.GraphQLString,
      resolve () {
        return 'world';
      }
    }
  }
});

var schema = new graphql.GraphQLSchema({query: queryType});
module.exports = schema;