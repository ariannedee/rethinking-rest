exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('user').del()
    .then(function(){
      return knex('book').del()
      .then(function(){
        return knex('hasRead').del()
        .then(function () {
          // Inserts seed entries
          return knex('user').insert([
            {id: 1, email: 'admin@test.com', username: 'admin', password: 'password', 'role': 'admin'},
            {id: 2, email: 'me@test.com', username: 'me', password: 'password', 'role': 'user'},
            {id: 3, email: 'friend1@test.com', username: 'friend1', password: 'password', 'role': 'user'},
            {id: 4, email: 'friend2@test.com', username: 'friend2', password: 'password', 'role': 'user'},
          ])
          .then(function () {
            return knex('book').insert([
              {id: 1, title: 'Pride and Prejudice', author: 'Jane Austen', fiction: true, publishedYear: 1813},
              {id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', fiction: true, publishedYear: 1960},
              {id: 3, title: 'Jane Eyre', author: 'Charlotte Brontë', fiction: true, publishedYear: 1847},
              {id: 4, title: '1984', author: 'George Orwell', fiction: true, publishedYear: 1949},
              {id: 5, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', fiction: true, publishedYear: 1925},
              {id: 6, title: 'The Diary of a Young Girl', author: 'Anne Frank', fiction: false, publishedYear: 1947},
              {id: 7, title: 'Brave New World', author: 'Aldous Huxley', fiction: true, publishedYear: 1932},
              {id: 8, title: 'Catcher in the Rye', author: 'J.D. Salinger', fiction: true, publishedYear: 1951},
              {id: 9, title: 'Lord of the Flies', author: 'William Golding', fiction: true, publishedYear: 1954},
              {id: 10, title: 'Wuthering Heights', author: 'Emily Brontë', fiction: true, publishedYear: 1847},
              {id: 11, title: 'The Grapes of Wrath', author: 'John Steinbeck', fiction: true, publishedYear: 1939},
              {id: 12, title: 'The Count of Monte Cristo', author: 'Alexandre Dumas', fiction: true, publishedYear: 1844},
              {id: 13, title: 'Rebecca', author: 'Daphne Du Maurier', fiction: true, publishedYear: 1938},
              {id: 14, title: 'Anna Karenina', author: 'Leo Tolstoy', fiction: true, publishedYear: 1878},
              {id: 15, title: 'The Bell Jar', author: 'Sylvia Plath', fiction: true, publishedYear: 1963},
              {id: 16, title: 'The War of the Worlds', author: 'H.G. Wells', fiction: true, publishedYear: 1898},
              {id: 17, title: 'The Curious Incident of the Dog in the Night-Time', author: 'Mark Haddon', fiction: true, publishedYear: 2003},
              {id: 18, title: 'Birdsong', author: 'Sebastian Faulks', fiction: true, publishedYear: 1993},
              {id: 19, title: 'Frankenstein', author: 'Mary Shelley', fiction: true, publishedYear: 1818},
              {id: 20, title: 'Life of Pi', author: 'Yann Martel', fiction: true, publishedYear: 2001},
            ])
            .then(function() {
              return knex('hasRead').insert([
                {userId: 2, bookId: 17, rating: 9},
                {userId: 2, bookId: 7, rating: 8},
                {userId: 1, bookId: 1, rating: 7},
                {userId: 3, bookId: 7, rating: 10},
                {userId: 3, bookId: 20, rating: 6},
                {userId: 4, bookId: 12, rating: 7}
              ]);
            });
          });
        });
      });
    });
};
