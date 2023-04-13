import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Col, Row, Button, ListGroup, Navbar, Form, Table } from 'react-bootstrap';
import dayjs from 'dayjs';
import MyButton from './Button.jsx';
import { BsFilm, BsPersonCircle, BsStar, BsStarFill } from 'react-icons/bs';

"use strict";
/*
const dayjs = require("dayjs");
const sqlite=require("sqlite3");
const db=new sqlite.Database("films.db");

const dayjs = require('dayjs');
let localizedFormat = require('dayjs/plugin/localizedFormat')
*/

dayjs().format('L LT');

function Film(id, title, favorites = false, date = "<not defined>", rating = "<not assigned>") {
  this.id = id;
  this.title = title;
  this.favorites = !!favorites;
  this.date = dayjs(date);
  this.rating = rating;
  this.str = () => "Id: " + this.id + ", Title: " + this.title + ", Favorites: " + this.favorites + ", Watch date: " + (this.date.isValid() ? this.date.format('LL') : "<not defined>") + ", Rating: " + this.rating;
  this.html = () =>
    <tr key={this.id}>
      <th id={this.favorites ? "fav" : ""}>{this.title}</th>
      <th><Form className={this.favorites ? "" : "hide"}><Form.Check inline disabled defaultChecked={this.favorites} />Favorite</Form></th>
      <th>{this.date.isValid() ? this.date.format('MMMM D, YYYY') : ""}</th>
      <th><StarRating rating={this.rating} /></th>
    </tr>
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
  this.addNewFilm = (film) => this.films.push(film);
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
  }
  this.resetWatchedFilms = () => {
    this.films.forEach(film => film.date = dayjs("<not defined>"));
  }
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
      let listOfFilms = [];
      for (let film of this.films) {
        if (film.favorites) {
          listOfFilms.push(film);
        }
      }
      return listOfFilms;
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
      let listOfFilms = [];
      for (let film of this.films) {
        if (film.rating >= rating) {
          listOfFilms.push(film);
        }
      }
      return listOfFilms;
    }
  };
  this.title = (string) => {
    if (DB) {
      return new Promise((resolve, reject) => {
        db.all('SELECT * FROM films WHERE title LIKE ?', ['%' + string + '%'], (err, rows) => {
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
  this.store = (film) => {
    if (DB) {
      return new Promise((resolve, reject) => { //doesnt insert id because is autoincremented by db
        db.run('INSERT INTO films (title,favorite,watchdate,rating) VALUES(?,?,?,?)', [film.title, (film.favorite == true) ? 1 : 0, film.date.isValid() ? film.date.format('YYYY-MM-DD') : null, film.rating == "<not assigned>" ? null : film.rating], (err) => {
          if (err) {
            reject("Error: insert rejected!");
          }

          db.all('SELECT last_insert_rowid() AS rowid FROM films', [], (err, rows) => {
            if (err) {
              reject(err);
            }
            film.id = rows[0].rowid;
            resolve("insert completed with id: " + rows[0].rowid);
          });
        });
      });
    }
    else {
      this.films.push(film);
    }
  }
  this.delete = (id) => {
    if (DB) {
      return new Promise((resolve, reject) => {
        db.run('DELETE FROM films WHERE id=?', [id], (err) => {
          if (err) {
            reject("Error: delete rejected!");
          }
          resolve("delete completed");
        });
      });
    }
    else {
      //TODO
    }
  }
  this.seenLaterThan = (date) => {
    if (DB) {
      //TODO
    }
    else {
      let listOfFilms = [];
      for (let film of this.films) {
        if (film.date.isAfter(dayjs(date))) {
          listOfFilms.push(film);
        }
      }
      return listOfFilms;
    }
  }
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
      return listOfFilms;
    }
  }
}

function StarRating(props) {
  const rating = props.rating;
  const stars = [0, 1, 2, 3, 4].map((i) => {
    if (i < rating)
      return <BsStarFill key={"star-"+i}/>;
    else
      return <BsStar key={"star-"+i}/>;
  });
  return (
    <div id="five-star-rating">
      {stars}
    </div>);
}

function ListFilter(props) {

  const filters = props.filters;
  const active = props.active;
  const setActive = props.setActive;
  const listItems = filters.map(
    (filter) => <Button variant="primary" size="lg" type="button" className={"list-group-item list-group-item-action" + (active == filter ? " active" : "")} id={"list-" + filter} key={"list-"+filter} href={"#list-" + filter} onClick={() => setActive(filter)} >{filter.replaceAll('_', ' ')}</Button>
  );
  return (<ListGroup id="list-tab">{listItems}</ListGroup>);
}

function FilterTable(props) {
  const filmList = props.filmList;
  const filmDisplay = filmList.map((film) => film.html());
  return (
    <Table className="table">
      <thead>
      </thead>
      <tbody>
        {filmDisplay}
      </tbody>
    </Table>

  );
}

function App() {
  const [active, setActive] = useState('All');
  const fl = new FilmLibrary();
  for (let el of localFile)
    fl.addNewFilm(el);
  const filters = ['All', 'Favorites', 'Best_Rated', 'Seen_Last_Month', 'Unseen'];
  const actions = [fl.all(), fl.favorite(), fl.rating(5), fl.seenLaterThan(dayjs().subtract(1, 'month')), fl.unseen()];
  return (
    <div className="container-fluid px-0">
      <Navbar bg="primary" variant="dark" expand="lg">
        <Navbar.Collapse>
          <Navbar.Brand className="mr-auto" href="index.html">
            <BsFilm className="App-logo" />
            Film Library
          </Navbar.Brand>
          <Form className="m-auto">
            <Form.Control type="search" placeholder="Search" />
          </Form>
          <Navbar.Brand className="ml-auto" href="#">
            <BsPersonCircle className="Login-logo" />
          </Navbar.Brand>
        </Navbar.Collapse>
      </Navbar>
      <Row>
        <Col xs lg="3">
          <ListFilter filters={filters} active={active} setActive={setActive} />
        </Col>
        <Col>
          <h1>{active.replaceAll('_', ' ')}</h1>
          <FilterTable filmList={actions[filters.indexOf(active)]} />
          <Button type="button" id="store" className="btn btn-primary btn-floating rounded-circle" >
            +
          </Button>
        </Col>
      </Row>

    </div>
  );
}

export default App
