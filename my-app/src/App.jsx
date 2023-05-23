import dayjs from 'dayjs';
import { useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import AddForm from './components/AddForm';
import EditForm from './components/EditForm';
import VisualizeFilms from './components/VisualizeFilms';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import API from './API.jsx';

"use strict";

dayjs().format('L LT');

function Film(id, title, favorite = false, date = "<not defined>", rating = "<not assigned>") {
  this.id = id;
  this.title = title;
  this.favorite = !!favorite;
  this.date = dayjs(date);
  this.rating = rating;
}

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

  ///this.print = () => [...this.films].sort((a, b) => a.id - b.id).forEach(film => console.log(film.str()));

  this.sortByDate = () => [...this.films].sort((a, b) => {
    if (a.date.isValid() && b.date.isValid())
      return a.date.diff(b.date, 'day');
    else if (!a.date.isValid())
      return 1;
    else
      return -1;
  });

  this.all = () => {
    return this.films;
  };

  this.favorite = () => {
    return this.films.filter(film => film.favorites);
  };

  this.rating = (rating) => {
    return this.films.filter((film) => film.rating >= rating);
  };

  this.seenLaterThan = (date) => {
    return this.films.filter(film => film.date.isAfter(dayjs(date)));
  };

  this.unseen = () => {
    let listOfFilms = [];
    for (let film of this.films) {
      if (!film.date.isValid()) {
        listOfFilms.push(film);
      }
    }
    return this.films.filter(film => !film.date.isValid());
  };
}

const APIURL = new URL('http://localhost:3001');

function App() {

  const fl = new FilmLibrary();
  
  const actions = {
    'All': () => API.getAllFilms(),
    'Favorites': () => API.getFavoriteFilms(),
    'Best Rated': () => API.get5StarFilms(),
    'Seen Last Month': () => API.getLastMonthFilms(),
    'Unseen': () => API.getUnseenFilms()
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
