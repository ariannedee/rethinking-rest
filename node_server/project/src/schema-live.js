var graphql = require('graphql');
var knex = require('../db');

const UserType = new graphql.GraphQLObjectType({
  name: 'User',
  description: 'This is a user',
  fields: () => {
    return {
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
      },
      isAdmin: {
        type: graphql.GraphQLBoolean,
        resolve(user) {
          return user.role == 'admin';
        }
      }
    }
  }
});

var BookType = new graphql.GraphQLObjectType({
  name: 'Book',
  fields: {
    id: {
      type: graphql.GraphQLID,
      resolve(book) {
        return book.id;
      }
    }
  }
});

var queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new graphql.GraphQLList(UserType),
      resolve(root, args) {
        return knex('user');
      }
    },
    books: {
      type: graphql.GraphQLList(BookType),
      resolve(root) {
        return knex('book');
      }
    }
  }
});

const schema = new graphql.GraphQLSchema({query: queryType});
module.exports = schema;