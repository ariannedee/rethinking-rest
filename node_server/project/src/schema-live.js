const graphql = require('graphql');
const knex = require('../db');


const UserType = new graphql.GraphQLObjectType({
  name: 'User',
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
          return user.role === 'admin';
        }
      },
      booksRead: {
        type: graphql.GraphQLList(HasReadType),
        resolve(user) {
          return knex('hasRead').where('userId', user.id);
        }
      }
    }
  }
});

const BookType = new graphql.GraphQLObjectType({
  name: 'Book',
  fields: () => {
    return {
      id: {
        type: graphql.GraphQLID,
        resolve(book) {
          return book.id;
        }
      },
      title: {
        type: graphql.GraphQLString,
        resolve(book) {
          return book.title;
        }
      },
      author: {
        type: graphql.GraphQLString,
        resolve(book) {
          return book.author;
        }
      },
      publishedYear: {
        type: graphql.GraphQLInt,
        resolve(book) {
          return book.publishedYear;
        }
      },
      fiction: {
        type: graphql.GraphQLBoolean,
        resolve(book) {
          return book.fiction;
        }
      },
      readBy: {
        type: graphql.GraphQLList(HasReadType),
        resolve(book) {
          return knex('hasRead').where('bookId', book.id);
        }
      }
    }
  }
});


const HasReadType = new graphql.GraphQLObjectType({
  name: 'HasRead',
  fields: {
    user: {
      type: UserType,
      resolve(hasRead) {
        return knex('user').where('id', hasRead.userId).first();
      }
    },
    book: {
      type: BookType,
      resolve(hasRead) {
        return knex('book').where('id', hasRead.bookId).first();
      }
    },
    rating: {
      type: graphql.GraphQLInt,
      resolve(hasRead) {
        return hasRead.rating;
      }
    },
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
    },
    books: {
      type: new graphql.GraphQLList(BookType),
      args: {
        fiction: {
          type: graphql.GraphQLBoolean
        }
      },
      resolve(root, args) {
        let query = knex('book');

        if (args.fiction != null) {
          query = query.where('fiction', args.fiction);
        }

        return query;
      }
    },
  }
});

const schema = new graphql.GraphQLSchema({query: queryType});

module.exports = schema;