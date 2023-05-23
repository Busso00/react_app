//import package
const express = require('express');
const morgan = require('morgan');
const { check, validationResult } = require('express-validator');
const dao = require('./dao');

const port = 3001;

//create application
const app = express();
const cors = require('cors');
app.use(cors());

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());

//define routes & web pages
app.get('/', (req, res) => {
  res.send('Hello, world');
});

app.get('/api/films', (req, res) => {
  dao.listFilms().then(film => res.json(film))
    .catch(() => res.status(500).end());
});

app.get('/api/films/after/:date', (req, res) => {
  dao.listFilmsAfter(req.params.date).then(film => res.json(film))
    .catch(() => res.status(500).end());
});

app.get('/api/films/rating/:rating', (req, res) => {
  dao.listFilmsRating(req.params.rating).then(film => res.json(film))
    .catch(() => res.status(500).end());
});

app.get('/api/films/favorite', (req, res) => {
  dao.listFilmsFavorite().then(film => res.json(film))
    .catch(() => res.status(500).end());
});

app.get('/api/films/unseen', (req, res) => {
  dao.listFilmsUnseen().then(film => res.json(film))
    .catch(() => res.status(500).end());
});

app.get('/api/films/:id', async (req, res) => {
  try {
    const result = await dao.getFilm(req.params.id);
    if (result.error)
      res.status(404).json(result);
    else
      res.json(result);
  } catch (err) {
    res.status(500).end();
  }
});

app.post('/api/films', [
  check('title').isLength({ min: 1 }),
  check('favorite').isInt({ min: 0, max: 1 }),
  check('date').isDate({ format: 'YYYY-MM-DD', strictMode: true }),
  check('rating').isInt({ min: 0, max: 5 }),
  check('user').isInt()
],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    //reference integrity check
    const userId = req.body.user;
    const resultUser = await dao.getUser(userId);
    if (resultUser.error)
      res.status(404).json(resultUser);   // userId does not exist, please insert the user before the film
    else {
      const film = {
        title: req.body.title,
        favorite: req.body.favorite,
        date: req.body.date,
        rating: req.body.rating,
        user: req.body.user
      };
      try {
        const filmId = await dao.createFilm(film);
        res.status(201).json(filmId);
      } catch (err) {
        res.status(503).json({ error: `Database error during the creation of film ${film.title} by user ${film.user}` });
      }
    }
  });

app.put('/api/films/:id',
  [
    check('title').isLength({ min: 1 }),
    check('favorite').isInt({ min: 0, max: 1 }),
    check('date').isDate({ format: 'YYYY-MM-DD', strictMode: true }),
    check('rating').isInt({ min: 0, max: 5 }),
    check('user').isInt()
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    //reference integrity check
    const userId = req.body.user;
    const resultUser = await dao.getUser(userId);
    if (resultUser.error)
      res.status(404).json(resultUser);   // userId does not exist, please insert the user before the film
    else {
      const film = {
        id: req.params.id,
        title: req.body.title,
        favorite: req.body.favorite,
        date: req.body.date,
        rating: req.body.rating,
        user: req.body.user
      };
      try {
        const filmId = await dao.updateFilm(film);
        res.status(201).json(filmId);
      } catch (err) {
        res.status(503).json({ error: `Database error during the update of film ${req.params.id}` });
      }
    }

  });


app.put('/api/films/rating/:id',
  [
    check('rating').isInt({ min: 0, max: 5 }),
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      const filmId = await dao.updateFilmRating(req.params.id, req.body.rating);
      res.status(201).json(filmId);
    } catch (err) {
      res.status(503).json({ error: `Database error during the update of film ${req.params.id}` });
    }
  }
);

app.put('/api/films/favorite/:id',
  [
    check('favorite').isInt({ min: 0, max: 1 }),
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      const filmId = await dao.updateFilmFavorite(req.params.id, req.body.favorite);
      res.status(201).json(filmId);
    } catch (err) {
      res.status(503).json({ error: `Database error during the update of film ${req.params.id}` });
    }
  }
);

app.delete('/api/films/:id', async (req, res) => {
  try {
    const numRowChanges = await dao.deleteFilm(req.params.id);
    // number of changed rows is sent to client as an indicator of success
    res.json(numRowChanges);
  } catch (err) {
    res.status(503).json({ error: `Database error during the deletion of film ${req.params.id}.` });
  }
});

/**Express db */
// Activate the server
app.listen(port, () => {
  console.log(`filmdb listening at http://localhost:${port}`);
});