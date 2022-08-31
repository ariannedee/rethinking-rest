const { query } = require('express');
const graphql = require('graphql');

const queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  description: 'The root query',
  fields: {
    hello: {
      description: 'Hello world!',
      type: graphql.GraphQLString,
      resolve() {
        return 'world';
      }
    }
  }
});

const schema = new graphql.GraphQLSchema({query: queryType});

module.exports = schema;