import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Col, Row, Button, ListGroup, Navbar, Form, Table, Alert } from 'react-bootstrap';
import dayjs from 'dayjs';
import { BsFilm, BsPersonCircle, BsStar, BsStarFill } from 'react-icons/bs';

"use strict";

dayjs().format('L LT');

function Film(id, title, favorites = false, date = "<not defined>", rating = "<not assigned>") {
  this.id = id;
  this.title = title;
  this.favorites = !!favorites;
  this.date = dayjs(date);
  this.rating = rating;
  this.str = () => "Id: " + this.id + ", Title: " + this.title + ", Favorites: " + this.favorites + ", Watch date: " + (this.date.isValid() ? this.date.format('LL') : "<not defined>") + ", Rating: " + this.rating;
  this.html = () =>
    <tr key={"film-"+this.id}>
      <th id={this.favorites ? "fav" : ""}>{this.title}</th>
      <th><Form><Form.Check className={"checkbox-filter-"+(this.favorites ? "not-hide" : "hide")}inline disabled defaultChecked={this.favorites} label="Favorite"/></Form></th>
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
  this.addNewFilm = (film) => {
    this.films.push(film);
    return this.films;
  }
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
      return this.films.filter(film => film.date.isAfter(dayjs(date)));
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
      return this.films.filter(film => !film.date.isValid());
    }
  }
}

function StarRating(props) {
  const rating = props.rating;
  const stars = [0, 1, 2, 3, 4].map((i) => {
    if (i < rating)
      return <BsStarFill key={"star-" + i} />;
    else
      return <BsStar key={"star-" + i} />;
  });
  return (
    <div id="five-star-rating">
      {stars}
    </div>
  );
}

function ListFilter(props) {

  const filters = props.filters;
  const active = props.active;
  const setActive = props.setActive;
  const setFilms = props.setFilms;
  const actions = props.actions;
  const allfilms = props.allfilms;

  let fl = new FilmLibrary();
  allfilms.forEach((el) => fl.addNewFilm(el));

  const listItems = filters.map(
    (filter, index) => <Button variant="primary" size="lg" type="button"
      className={"list-group-item list-group-item-action" + (active == filter ? " active" : "")} id={"list-" + filter} key={"list-" + filter}
      href={"#list-" + filter} onClick={() => { setActive(filter); setFilms(actions[index](fl)); }}>{filter.replaceAll('_', ' ')}</Button>
  );
  return (<ListGroup id="list-tab">{listItems}</ListGroup>);
}

function FilterTable(props) {

  const filmDisplay = props.films.map((film) => film.html());
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

function AddForm(props) {

  const allfilms = props.allfilms;
  const setAllfilms = props.setAllfilms;
  const closeForm = props.closeForm;
  const updateFilms = props.updateFilms;

  const [title, setTitle] = useState(props.editObj ? props.editObj.title : '');
  const [favorite, setFavorite] = useState(props.editObj ? props.editObj.favorite : false);
  const [date, setDate] = useState(props.editObj ? props.editObj.date.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'));  //string: dayjs object is created only on submit
  const [rating, setRating] = useState(props.editObj ? props.editObj.score : 0);

  const [errorMsg, setErrorMsg] = useState('');

  const [id, setId] = useState(6);//id must be unique!!! genera errori di duplicazione record

  function handleSubmit(event) {
    event.preventDefault();
    //console.log('premuto submit');

    // Form validation
    if (date === '')
      setErrorMsg('Data non valida');
    else if (isNaN(parseInt(rating)) || ((rating > 5) || (rating < 0)))
      setErrorMsg('Rating non valido');
    else if (title === '') {
      setErrorMsg('Titolo non valido');
    }
    else {
      const new_film = new Film(id, title, favorite, date, rating);
      let fl = new FilmLibrary();
      allfilms.forEach(film => fl.addNewFilm(film));
      setAllfilms(fl.addNewFilm(new_film));//update based on preview state
      updateFilms(fl);

      setId(id => id + 1);
      setErrorMsg('');
    }
  }

  function handleChange(e) {
    const isChecked = e.target.checked;
    setFavorite(isChecked);
  }

  return (
    <>
      {errorMsg ? <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : false}
      <Form onSubmit={handleSubmit}>
        <Row >
          <Form.Group as={Col} className="my-3">
            <Form.Label visuallyHidden>Title</Form.Label>
            <Form.Control type="text" name="title" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="Title" />

          </Form.Group>

          <Form.Group as={Col} className="my-3">
            <Form.Check type="checkbox" id="favorite" label="Favorite" value={favorite} onChange={ev => handleChange(ev)} />
          </Form.Group>

          <Form.Group as={Col} className="my-3">
            <Form.Label visuallyHidden>Watchdate</Form.Label>
            <Form.Control type="date" name="watchdate" value={date} onChange={ev => setDate(ev.target.value)}/>

          </Form.Group>

          <Form.Group as={Col} className="my-3">
            <Form.Label visuallyHidden>Rating</Form.Label>
            <Form.Control type="number" name="rating" value={rating} onChange={ev => setRating(ev.target.value)}/>
          </Form.Group>

          <Button type='submit' variant="primary">Add</Button>
          <Button variant='warning' onClick={closeForm}>Cancel</Button>
        </Row>
      </Form>
    </>
  );
}

function App() {

  const fl = new FilmLibrary();
  for (let el of localFile)
    fl.addNewFilm(el);
  const filters = ['All', 'Favorites', 'Best_Rated', 'Seen_Last_Month', 'Unseen'];
  const actions = [
    (fl) => fl.all(),
    (fl) => fl.favorite(),
    (fl) => fl.rating(5), (fl) => fl.seenLaterThan(dayjs().subtract(1, 'month')),
    (fl) => fl.unseen(),
    (fl, film) => fl.addNewFilm(film)//this is not indexed by left side buttons
  ];
  const [active, setActive] = useState(filters[0]);
  const [films, setFilms] = useState(actions[0](fl));
  const [allfilms, setAllfilms] = useState(fl.all());
  const [add, setAdd] = useState(false);


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
          <ListFilter 
            filters={filters/* nomi dei filtri, statico */} 
            allfilms={allfilms/* si filtra partendo da tutti*/}
            actions={actions/* filtri statici, varia fl(da allfilms)*/} 
            active={active /*leggere stato per evidenziare bottone corretto */}
            setActive={setActive/* lo stato filtro attivo deve poter essere settato al click*/}
            setFilms={setFilms/* i film visualizzati vanno messi nello stato films */}/>
        </Col>
        <Col>
          <h1>{active.replaceAll('_', ' ')}</h1>
          <FilterTable 
          films={films/* filter table visualizza solo i film del filtro attivo*/}
          />
          <div id="addFilm">
            {add ?
              <AddForm
                closeForm={() => setAdd(false)/* chiude form per add*/}
                allfilms={allfilms/* servono i film da cui partire per fare update*/}
                setAllfilms={setAllfilms/* funzione di update per allfilms*/}
                updateFilms={(fl)=>setFilms(actions[filters.findIndex((el)=>el==active)](fl))}
              /> :
              <Button type="button" id="store" className="btn btn-primary btn-floating rounded-circle" onClick={() => setAdd(true)}>
                +
              </Button>
            }
          </div>


        </Col>
      </Row>

    </div>
  );
}

export default App
