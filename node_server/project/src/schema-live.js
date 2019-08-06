const graphql = require('graphql');
const knex = require('../db');

const userType = new graphql.GraphQLObjectType({
    name: 'User',
    fields: () => {
        return {
            id: {
                type: graphql.GraphQLID,
                resolve (user) {
                    return user.id;
                }
            },
            username: {
                type: graphql.GraphQLString,
                resolve (user) {
                    return user.username;
                }
            },
            isAdmin: {
                type: graphql.GraphQLBoolean,
                resolve (user) {
                    return user.role == 'admin';
                }
            },
            booksRead: {
                type: graphql.GraphQLList(hasReadType),
                resolve (user) {
                    return knex('hasRead').where('userId', user.id);
                }
            }
        }
    }
});

const bookType = new graphql.GraphQLObjectType({
    name: 'Book',
    fields: () => {
        return {
            id: {
                type: graphql.GraphQLID,
                resolve (book) {
                    return book.id;
                }
            },
            title: {
                type: graphql.GraphQLString,
                resolve (book) {
                    return book.title;
                }
            },
            author: {
                type: graphql.GraphQLString,
                resolve (book) {
                    return book.author;
                }
            },
            fiction: {
                type: graphql.GraphQLBoolean,
                resolve (book) {
                    return book.fiction;
                }
            },
            averageRating: {
                type: graphql.GraphQLFloat,
                async resolve(book) {
                    let query = await knex('hasRead')
                    .where('bookId', book.id)
                    .avg('rating as avg_rating')
                    .first();
                    return query['avg_rating']
                }
            }
        }
    }
});

const hasReadType = new graphql.GraphQLObjectType({
    name: 'HasRead',
    fields: {
        book: {
            type: bookType,
            resolve (hasRead) {
                return knex('book').where('id', hasRead.bookId).first();
            }
        },
        rating: {
            type: graphql.GraphQLInt,
            resolve (hasRead) {
                return hasRead.rating;
            }
        }
    }
})

const queryType = new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
        users: {
            type: new graphql.GraphQLList(userType),
            resolve() {
                return knex('user');
            }
        },
        books: {
            type: new graphql.GraphQLList(bookType),
            resolve() {
                return knex('book');
            }
        }
    }
});

const schema = new graphql.GraphQLSchema({query: queryType});

module.exports = schema;