const graphql = require('graphql');
const knex = require('../db');

const UserType = new graphql.GraphQLObjectType({
    name: 'User',
    fields : {
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


const BookType = new graphql.GraphQLObjectType({
    name: 'Book',
    fields : {
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
        }
    }
});

const queryType = new graphql.GraphQLObjectType({
    name: 'Query',
    description: 'The root query',
    fields: {
        users: {
            type: new graphql.GraphQLList(UserType),
            resolve() {
                return knex('user');
            }
        },
        books: {
            type: new graphql.GraphQLList(BookType),
            resolve() {
                return knex('book');
            }
        }
    }
});

const schema = new graphql.GraphQLSchema({query: queryType});

module.exports = schema;