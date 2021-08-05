const graphql = require('graphql');

const queryType = new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
        hello: {
            type: graphql.GraphQLString,
            resolve() {
                return 'world';
            }
        }
    }
});

const schema = new graphql.GraphQLSchema({query: queryType});
module.exports = schema;const graphql = require('graphql');
const knex = require('../db');

const UserType = new graphql.GraphQLObjectType({
  name: 'User',
  description: 'A user',
  fields: {
    id: {
      type: graphql.GraphQLID,
      resolve(user) {
        return user.id;
      }
    }
  }
});

const queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: graphql.GraphQLList(UserType),
      description: 'All users',
      resolve() {
        return knex('user');
      }
    }
  }
});

const schema = new graphql.GraphQLSchema({query: queryType});
module.exports = schema;