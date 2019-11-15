const graphql = require('graphql');
const knex = require('../db');

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
      fiction: {
        type: graphql.GraphQLBoolean,
        resolve(book) {
          return book.fiction;
        }
      },
      publishedYear: {
        type: graphql.GraphQLInt,
        resolve(book) {
          return book.publishedYear;
        }
      },
      readBy: {
        type: graphql.GraphQLList(HasReadType),
        resolve(book) {
          return knex('hasRead').where('bookId', book.id);
        }
      },
      averageRating: {
        type: graphql.GraphQLFloat,
        async resolve(book) {
          let query = await knex('hasRead').where('bookId', book.id).avg('rating as avg_rating').first();
          return query['avg_rating'];
        }
      }
    }
  }
});

const HasReadType = new graphql.GraphQLObjectType({
  name: 'HasRead',
  fields: {
    rating: {
      type: graphql.GraphQLInt,
      resolve(hasRead) {
        return hasRead.rating;
      }
    },
    book: {
      type: BookType,
      resolve(hasRead) {
        return knex('book').where('id', hasRead.bookId).first();
      }
    },
    user: {
      type: UserType,
      resolve(hasRead) {
        return knex('user').where('id', hasRead.userId).first();
      }
    },
  }
});

const queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new graphql.GraphQLList(UserType),
      resolve(root) {
        return knex('user');
      }
    },
    books: {
      type: new graphql.GraphQLList(BookType),
      resolve(root) {
        return knex('book');
      }
    },
  }
});

const schema = new graphql.GraphQLSchema({query: queryType});

module.exports = schema;