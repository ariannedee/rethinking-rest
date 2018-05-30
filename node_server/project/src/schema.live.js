var graphql = require('graphql');
var knex = require('../db');

const UserType = new graphql.GraphQLObjectType({
    name: 'User',
    description: 'A user object',
    fields: {
        id: {
            type: graphql.GraphQLNonNull(graphql.GraphQLID),
            resolve(user) {
                return user.id;
            }
        }
    }
});

var queryType = new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
        users: {
            type: new graphql.GraphQLList(UserType),
            description: 'A list of users',
            resolve(root) {
                let query = knex('user');
                return query;
            }
        }
    }
});

const schema = new graphql.GraphQLSchema({query: queryType});
module.exports = schema;