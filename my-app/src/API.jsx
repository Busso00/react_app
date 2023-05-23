import dayjs from 'dayjs';

const URL = 'http://localhost:3001/api';


function Film(id, title, favorite = false, date = "<not defined>", rating = "<not assigned>") {
    this.id = id;
    this.title = title;
    this.favorite = !!favorite;
    this.date = dayjs(date);
    this.rating = rating;
}

async function getAllFilms() {
    const response = await fetch(URL + '/films');
    const films = await response.json();

    if (response.ok){
        return films.map((f) => (new Film(f.id, f.title, f.favoorites, f.date, f.rating)));
    } else {
        throw films;
    }
}

async function getFavoriteFilms() {
    const response = await fetch(URL + '/films/favorite');
    const films = await response.json();

    if (response.ok){
        return films.map((f) => (new Film(f.id, f.title, f.favoorites, f.date, f.rating)));
    } else {
        throw films;
    }
}

async function get5StarFilms() {
    const response = await fetch(URL + '/films/rating/5');
    const films = await response.json();

    if (response.ok){
        return films.map((f) => (new Film(f.id, f.title, f.favoorites, f.date, f.rating)));
    } else {
        throw films;
    }
}

async function getLastMonthFilms() {
    const response = await fetch(URL + '/films/after/' + dayjs().subtract(1, 'month').format('YYYY-MM-DD'));
    const films = await response.json();
    
    if (response.ok){
        return films.map((f) => (new Film(f.id, f.title, f.favoorites, f.date, f.rating)));
    } else {
        throw films;
    }
}

async function getUnseenFilms() {
    const response = await fetch(URL + '/films/unseen');
    const films = await response.json();

    if (response.ok){
        return films.map((f) => (new Film(f.id, f.title, f.favoorites, f.date, f.rating)));
    } else {
        throw films;
    }
}

const API = { getAllFilms, getFavoriteFilms, get5StarFilms, getLastMonthFilms, getUnseenFilms };
export default API;