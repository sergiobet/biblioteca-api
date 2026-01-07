db.createUser({
  user: 'library_admin',
  pwd: 'library_password_123',
  roles: [
    {
      role: 'readWrite',
      db: 'library_db'
    }
  ]
});

db.createCollection('users');
db.createCollection('books');
db.createCollection('loans');
db.createCollection('authors');

// Índices para performance
db.users.createIndex({ email: 1 }, { unique: true });
db.books.createIndex({ title: 'text', author: 'text', description: 'text' });
db.books.createIndex({ isbn: 1 }, { unique: true, sparse: true });
db.loans.createIndex({ userId: 1, returnedAt: 1 });
db.loans.createIndex({ dueDate: 1 });