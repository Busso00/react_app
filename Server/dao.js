'use strict';
/* Data Access Object (DAO) module for accessing questions and answers */

const sqlite = require('sqlite3');
const dayjs = require('dayjs');

// open the database
const db = new sqlite.Database('films.db', (err) => {
  if (err) throw err;
});

function Film(id, title, favorites = false, date = "<not defined>", rating = "<not assigned>") {
  this.id = id;
  this.title = title;
  this.favorites = !!favorites;
  this.date = dayjs(date);
  this.rating = rating;
}

exports.listFilms = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM films';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const listFilms = rows.map((row) => new Film(row.id, row.title, row.favorite, row.watchdate, row.rating));
      resolve(listFilms);
    });
  });
}

exports.listFilmsAfter = (date) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM films WHERE watchdate>?';
    db.all(sql, [dayjs(date).format('YYYY-MM-DD')], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const listFilms = rows.map((row) => new Film(row.id, row.title, row.favorite, row.watchdate, row.rating));
      resolve(listFilms);
    });
  });
}

exports.listFilmsRating = (rate) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM films WHERE rating==?';
    db.all(sql, [rate], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const listFilms = rows.map((row) => new Film(row.id, row.title, row.favorite, row.watchdate, row.rating));
      resolve(listFilms);
    });
  });
}

exports.listFilmsFavorite = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM films WHERE favorite==1';
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const listFilms = rows.map((row) => new Film(row.id, row.title, row.favorite, row.watchdate, row.rating));
      resolve(listFilms);
    });
  });
}

exports.listFilmsUnseen = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM films WHERE watchdate IS NULL';
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const listFilms = rows.map((row) => new Film(row.id, row.title, row.favorite, row.watchdate, row.rating));
      resolve(listFilms);
    });
  });
}

exports.getFilm = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM films WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row == undefined) {
        resolve({ error: 'Film id not found.' });
      } else {
        const film = new Film(row.id, row.title, row.favorite, row.watchdate, row.rating);
        resolve(film);
      }
    });
  });
}

exports.getUser = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row == undefined) {
        resolve({ error: 'User id not found.' });
      } else {
        resolve(row.id);
      }
    });
  });
}

exports.createFilm = (film) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO films (title, favorite, watchdate, rating, user) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [film.title, film.favorite, film.date, film.rating, film.user], function (err) {
      if (err) {
        reject(err);
        console.log(err);
        return;
      }
      resolve(this.lastID);
    });
  });
}

exports.updateFilm = (film) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE films SET title=?, favorite=?, watchdate=?, rating=?, user=? WHERE id=?';
    db.run(sql, [film.title, film.favorite, film.date, film.rating, film.user, film.id], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.changes);//nuber of updated rows
    })
  });
}

exports.updateFilmRating = (id,rating) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE films SET rating=? WHERE id=?';
    db.run(sql, [rating, id], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.changes);//nuber of updated rows
    });
  });
}

exports.updateFilmFavorite = (id,favorite) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE films SET favorite=? WHERE id=?';
    db.run(sql, [favorite, id], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.changes);//number of updated rows
    });
  });
}

exports.deleteFilm = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM films WHERE id = ?';
    db.run(sql, [id], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.changes); //number of deleted rows
    });
  });
}