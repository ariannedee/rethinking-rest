const graphql = require('graphql');
const knex = require('../db');


const UserType = new graphql.GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: graphql.GraphQLID,
      resolve(user) {
        return user.id;
      }
    },
    username: {
      type: graphql.GraphQLString,
      resolve(user) {
        return user.username;
      }
    }
  }
});

const queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new graphql.GraphQLList(UserType),
      resolve() {
        return knex('user');
      }
    }
  }
});

const schema = new graphql.GraphQLSchema({query: queryType});

module.exports = schema;