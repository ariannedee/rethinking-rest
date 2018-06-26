var graphql = require('graphql');
var knex = require('../db');

const UserType = new graphql.GraphQLObjectType({
  name: 'User',
  description: 'This represents a User',
  fields: {
    id: {
      type: graphql.GraphQLID,
      resolve(user) {
        return user.id;
      }
    },

  }
})

var queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new graphql.GraphQLList(UserType),
      resolve(root, args, context) {
        return knex('user');
      }
    }
  }
});

var schema = new graphql.GraphQLSchema({query: queryType});
module.exports = schema;