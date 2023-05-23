import { Col, Row, Button } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import ListFilter from './ListFilter';
import FilterTable from './FilterTable';
import MyNavbar from './MyNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import API from '../API.jsx';


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


function VisualizeFilms(props) {

  let active = props.active || useParams().active.replace(":", "");

  useEffect(() => {
    props.actions[active]()
      .then((flist)=>{
        const flibrary=new FilmLibrary();
        flist.forEach((film)=>{
          flibrary.addNewFilm(film);
        });
        props.setFilmlibrary(flibrary);
      })
      .catch(err => console.error(err)
    );
  },[active]);

  return (
    <div className="container-fluid px-0">
      <MyNavbar />
      <Row>
        <Col xs lg="3">
          <ListFilter filters={Object.keys(props.actions)} active={active} />
        </Col>
        <Col>
          <h1>{active}</h1>
          <FilterTable films={props.filmlibrary} setFilmlibrary={props.setFilmlibrary} />
          <Link to="/add" ><Button variant={'primary'} className="rounded-circle" >+</Button></Link>
        </Col>
      </Row>
    </div>
  );
}

export default VisualizeFilms;