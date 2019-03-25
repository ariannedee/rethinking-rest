const graphql = require('graphql');
const knex = require('../db');
const { readBook } = require('./models');

const UserType = new graphql.GraphQLObjectType({
    name: 'User',
    description: 'This represents a User',
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
            },
            averageRating: {
                type: graphql.GraphQLFloat,
                async resolve(user) {
                    let query = await knex('hasRead')
                    .where('userId', user.id)
                    .avg('rating as avg_rating')
                    .first();
                    return query['avg_rating']
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

const HasReadType = new graphql.GraphQLObjectType({
    name: 'HasRead',
    description: 'This represents a user who has read a book and given it a rating (optional)',
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

const paginationArgs = {
    first: {
        type: graphql.GraphQLInt,
        defaultValue: 10
    },
    offset: {
        type: graphql.GraphQLInt,
        defaultValue: null
    }
}

const queryType = new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
        users: {
            type: graphql.GraphQLList(UserType),
            description: 'A list of users',
            args: paginationArgs,
            resolve(root, args) {
                let query = knex('user');
                const limit = args.first;
                const offset = args.offset;
                if (limit) {
                    query = query.limit(limit);
                }
                if (offset) {
                    query = query.offset(offset);
                }

                return query;
            }
        },
        books: {
            type: graphql.GraphQLList(BookType),
            args: {
                fiction: {
                    type: graphql.GraphQLBoolean,
                }, ...paginationArgs
            },
            resolve(root, args) {
                let query = knex('book');
                
                const limit = args.first;
                const offset = args.offset;
                if (limit) {
                    query = query.limit(limit);
                }
                if (offset) {
                    query = query.offset(offset);
                }

                if (args.fiction != null) {
                    query = query.where('fiction', args.fiction);
                }
                return query;
            }
        },
        user: {
            type: UserType,
            args: {
                id: {
                    type: graphql.GraphQLNonNull(graphql.GraphQLInt)
                }
            },
            resolve(root, args) {
                return knex('user').where('id', args.id).first();
            }
        },
        book: {
            type: BookType,
            args: {
                id: {
                    type: graphql.GraphQLNonNull(graphql.GraphQLInt)
                }
            },
            resolve(root, args) {
                return knex('book').where('id', args.id).first();             
            }
        }
    }
});

const mutationType = new graphql.GraphQLObjectType({
    name: 'Mutation',
    fields: () => {
        return {
            readBook: {
                type: HasReadType,
                description: 'Read and rate (optional) a book',
                args: {
                    user: {
                        type: graphql.GraphQLNonNull(graphql.GraphQLInt)
                    },
                    book: {
                        type: graphql.GraphQLNonNull(graphql.GraphQLInt)
                    },
                    rating: {
                        type: graphql.GraphQLInt,
                        defaultValue: null
                    }
                },
                async resolve(source, args) {
                    userId = args.user;
                    bookId = args.book;
                    rating = args.rating;

                    return await readBook(bookId, userId, rating);
                }
            }
        }
    }
});

const schema = new graphql.GraphQLSchema({query: queryType, mutation: mutationType});
module.exports = schema;
