import dayjs from 'dayjs';
import { useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import AddForm from './components/AddForm';
import EditForm from './components/EditForm';
import VisualizeFilms from './components/VisualizeFilms';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

"use strict";

dayjs().format('L LT');

function Film(id, title, favorites = false, date = "<not defined>", rating = "<not assigned>") {
  this.id = id;
  this.title = title;
  this.favorites = !!favorites;
  this.date = dayjs(date);
  this.rating = rating;
  //this.str = () => "Id: " + this.id + ", Title: " + this.title + ", Favorites: " + this.favorites + ", Watch date: " + (this.date.isValid() ? this.date.format('LL') : "<not defined>") + ", Rating: " + this.rating;
}

const DB = false;
const f1 = new Film(1, "Pulp Fiction", true, "2023-03-10", 5);
const f2 = new Film(2, "21 Grams", true, "2023-03-17", 4);
const f3 = new Film(3, "Star Wars");
const f4 = new Film(4, "Matrix", false);
const f5 = new Film(5, "Shrek", false, "2023-03-21", 3);
const localFile = [f1, f2, f3, f4, f5];

function FilmLibrary() {
  
  this.films = [];

  this.addNewFilm = (film) => {
    this.films.push(film);
    return this;
  };

  this.addNewFilmParams = (id, title, favorite, date, rating) => {
    const film = new Film(id, title, favorite, date, rating);
    return this.addNewFilm(film);
  };

  this.modFilmById = (id, newtitle, newfavorite, newdate, newrating) => {
    this.films = this.films.map((film) => {
      if (film.id === id)
        return new Film(id, newtitle, newfavorite, newdate, newrating);
      else
        return film;
    })
    return this;
  };

  this.delete = (id) => {
    this.films = this.films.filter((film) => film.id != id);
    return this;
  };

  this.print = () => [...this.films].sort((a, b) => a.id - b.id).forEach(film => console.log(film.str()));

  this.sortByDate = () => [...this.films].sort((a, b) => {
    if (a.date.isValid() && b.date.isValid())
      return a.date.diff(b.date, 'day');
    else if (!a.date.isValid())
      return 1;
    else
      return -1;
  });

  this.deleteFilm = (id) => {
    let index = this.films.findIndex((a) => { return a.id == id });
    if (index != -1)
      this.films.splice(index, 1);
    else
      console.log("Id not found");
  };

  this.resetWatchedFilms = () => {
    this.films.forEach(film => film.date = dayjs("<not defined>"));
  };

  this.getRated = () => [...this.films].filter(film => film.rating != "<not assigned>");

  this.all = () => {
    if (DB) {
      return new Promise((resolve, reject) => {
        //? come simulare l'attesa della risposta dal server
        db.all('SELECT * FROM films', [], (err, rows) => {
          if (err) {
            reject(err);
          }
          const listOfFilms = []
          for (let row of rows) {
            listOfFilms.push(new Film(row.id, row.title, row.favorite, row.watchdate, row.rating));
          }
          resolve(listOfFilms);
        });
      });
    }
    else {
      return this.films;
    }
  };

  this.favorite = () => {
    if (DB) {
      return new Promise((resolve, reject) => {
        db.all('SELECT * FROM films WHERE favorite=1', [], (err, rows) => {
          if (err) {
            reject(err);
          }
          const listOfFilms = []
          for (let row of rows) {
            listOfFilms.push(new Film(row.id, row.title, row.favorite, row.watchdate, row.rating));
          }
          resolve(listOfFilms);
        });
      });
    }
    else {

      return this.films.filter(film => film.favorites);
    }
  };

  this.watchedToday = () => {
    if (DB) {
      return new Promise((resolve, reject) => {
        db.all('SELECT * FROM films WHERE watchdate=?', [dayjs().format('YYYY-MM-DD')], (err, rows) => {
          if (err) {
            reject(err);
          }
          const listOfFilms = []
          for (let row of rows) {
            listOfFilms.push(new Film(row.id, row.title, row.favorite, row.watchdate, row.rating));
          }
          resolve(listOfFilms);
        });
      });
    }
    else {
      //TODO
    }
  };

  this.watchedDate = (date) => {
    if (DB) {
      return new Promise((resolve, reject) => {
        db.all('SELECT * FROM films WHERE watchdate<?', [dayjs(date).format('YYYY-MM-DD')], (err, rows) => {
          if (err) {
            reject(err);
          }
          const listOfFilms = []
          for (let row of rows) {
            listOfFilms.push(new Film(row.id, row.title, row.favorite, row.watchdate, row.rating));
          }
          resolve(listOfFilms);
        });
      });
    }
    else {
      //TODO
    }
  };

  this.rating = (rating) => {
    if (DB) {
      return new Promise((resolve, reject) => {
        db.all('SELECT * FROM films WHERE rating>=?', [rating], (err, rows) => {
          if (err) {
            reject(err);
          }
          const listOfFilms = []
          for (let row of rows) {
            listOfFilms.push(new Film(row.id, row.title, row.favorite, row.watchdate, row.rating));
          }
          resolve(listOfFilms);
        });
      });
    }
    else {
      return this.films.filter((film) => film.rating >= rating);
    }
  };

  this.title = (title) => {
    if (DB) {
      return new Promise((resolve, reject) => {
        db.all('SELECT * FROM films WHERE title LIKE ?', ['%' + title + '%'], (err, rows) => {
          if (err) {
            reject(err);
          }
          const listOfFilms = []
          for (let row of rows) {
            listOfFilms.push(new Film(row.id, row.title, row.favorite, row.watchdate, row.rating));
          }
          resolve(listOfFilms);
        });
      });
    }
    else {
      //TODO
    }
  };

  this.seenLaterThan = (date) => {
    if (DB) {
      //TODO
    }
    else {
      return this.films.filter(film => film.date.isAfter(dayjs(date)));
    }
  };

  this.unseen = () => {
    if (DB) {
      //TODO
    }
    else {
      let listOfFilms = [];
      for (let film of this.films) {
        if (!film.date.isValid()) {
          listOfFilms.push(film);
        }
      }
      return this.films.filter(film => !film.date.isValid());
    }
  };
}

function App() {

  const fl = new FilmLibrary();
  for (let el of localFile)
    fl.addNewFilm(el);

  const actions = {
    'All': (fl) => fl.all(),
    'Favorites': (fl) => fl.favorite(),
    'Best Rated': (fl) => fl.rating(5),
    'Seen Last Month': (fl) => fl.seenLaterThan(dayjs().subtract(1, 'month')),
    'Unseen': (fl) => fl.unseen()
  };

  const [id, setId] = useState(6);//id must be unique!!! genera errori di duplicazione record
  const [filmlibrary, setFilmlibrary] = useState(fl);//ricorda quando aggiungi o elimini un film di fare Object.assign

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<VisualizeFilms filmlibrary={filmlibrary} setFilmlibrary={setFilmlibrary} actions={actions} active={'All'} />} />
        
        <Route path="/filter/:active" element={<VisualizeFilms filmlibrary={filmlibrary} setFilmlibrary={setFilmlibrary} actions={actions} /*no active (from useParams)*/ />} />

        <Route path="/add" element={<AddForm filmlibrary={filmlibrary} setFilmlibrary={setFilmlibrary} filters={Object.keys(actions)} id={id} incrId={(id) => setId(id + 1)} />} />

        <Route path="/edit/:filmid" element={<EditForm filmlibrary={filmlibrary} setFilmlibrary={setFilmlibrary} filters={Object.keys(actions)} /*no id (from useParams)*/ />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App
