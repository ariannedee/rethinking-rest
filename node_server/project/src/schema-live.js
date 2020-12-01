const graphql = require('graphql');
const { __esModule } = require('graphql/graphql');

const queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  description: 'The root query',
  fields: {
    hello: {
      type: graphql.GraphQLString,
      resolve () {
        return 'world';
      }
    }
  }
});

const schema = new graphql.GraphQLSchema({query: queryType});

module.exports = schema;
