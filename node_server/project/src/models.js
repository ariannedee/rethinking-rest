const knex = require('../db');

async function getBook(bookId) {
    return await knex('book').where('id', bookId).first();
}

async function getUser(userId) {
    return await knex('user').where('id', userId).first();
}

async function readBook(bookId, userId, rating=null) {
    if (rating < 0 || rating > 10) {
        throw new Error(`Rating must be between 0 and 10, was ${rating}`);
    }

    const book = await getBook(bookId);
    if (!book) {
        throw new Error(`Book with id ${bookId} doesn't exist`);
    }

    const user = await getUser(userId);
    if (!user) {
        throw new Error(`User with id ${userId} doesn't exist`);
    }

    const hasRead = {bookId: bookId, userId: userId, rating: rating};

    const numUpdated = await knex('hasRead')
        .where('bookId', bookId)
        .where('userId', userId)
        .update({rating: rating});
    if (numUpdated == 0) {
        await knex('hasRead').insert(hasRead);
    }

    return hasRead;
}

module.exports = { readBook };
