import dayjs from 'dayjs';
import { useState } from 'react';
import { Col, Row, Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

function ModForm(props) {

  const navigate = useNavigate();
  function closeForm() {
    navigate(-1);
  }

  const modfilm = props.modfilm;
  const id = modfilm ? modfilm.id : props.id;
  const [title, setTitle] = useState(modfilm ? modfilm.title || '' : '');
  const [favorite, setFavorite] = useState(modfilm ? modfilm.favorites || false : false);
  const [date, setDate] = useState(modfilm ? (modfilm.date.isValid() ? modfilm.date.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')) : dayjs().format('YYYY-MM-DD'));  //string: dayjs object is created only on submit
  const [rating, setRating] = useState(modfilm ? (isNaN(parseInt(modfilm.rating)) ? 0 : modfilm.rating) : 0);

  const [errorMsg, setErrorMsg] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    if (date === '')
      setErrorMsg('Data non valida');
    else if (isNaN(parseInt(rating)) || ((rating > 5) || (rating < 0)))
      setErrorMsg('Rating non valido');
    else if (title === '') {
      setErrorMsg('Titolo non valido');
    }
    else {
      //modifying film
      //making visible modify to React (Object assign)
      if (modfilm) {
        props.setFilmlibrary(Object.assign({}, props.filmlibrary.modFilmById(id, title, favorite, date, rating)));
      }
      else {
        props.setFilmlibrary(Object.assign({}, props.filmlibrary.addNewFilmParams(id, title, favorite, date, rating)));
        props.incrId(id);
      }
      closeForm();
      setErrorMsg('');
    }
  }

  function handleChange(e) {
    const isChecked = e.target.checked;
    setFavorite(isChecked);
  }

  return (<>
    {errorMsg ? <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : false}
    <Form onSubmit={handleSubmit}>
      <Row>
        <Form.Group as={Col} className="my-3">
          <Form.Label visuallyHidden>Title</Form.Label>
          <Form.Control type="text" name="title" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="Title" />
        </Form.Group>

        <Form.Group as={Col} className="my-3">
          <Form.Check type="checkbox" id="favorite" label="Favorite" value={favorite} checked={favorite} onChange={ev => handleChange(ev)} />
        </Form.Group>

        <Form.Group as={Col} className="my-3">
          <Form.Label visuallyHidden>Watchdate</Form.Label>
          <Form.Control type="date" name="watchdate" value={date} onChange={ev => setDate(ev.target.value)} />
        </Form.Group>

        <Form.Group as={Col} className="my-3">
          <Form.Label visuallyHidden>Rating</Form.Label>
          <Form.Control type="number" name="rating" value={rating} onChange={ev => setRating(ev.target.value)} />
        </Form.Group>

        <Button type='submit' variant="primary">Add</Button>
        <Button variant="danger" onClick={closeForm}>Cancel</Button>
      </Row>
    </Form>
  </>);
}

export default ModForm;