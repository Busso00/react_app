import { Form , Button , Table} from 'react-bootstrap';
import { BsPencilSquare , BsTrash } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

function FilterTable(props) {

  const filmDisplay = props.films.map(film => {
    return (
    <tr key={"film-" + film.id}>
      <th id={film.favorites ? "fav" : ""}>{film.title}</th>
      <th><Form><Form.Check className={"checkbox-filter-" + (film.favorites ? "not-hide" : "hide")} inline disabled checked={film.favorites ? true : false} label="Favorite" /></Form></th>
      <th>{film.date.isValid() ? film.date.format('MMMM D, YYYY') : ""}</th>
      <th><StarRating rating={film.rating} /></th>
      <th><Link to={`/edit/:${film.id}`}><Button variant="primary"><BsPencilSquare/></Button></Link></th>
      <th><Button variant="danger" onClick={()=>props.setFilmlibrary(Object.assign({},props.filmlibrary.delete(film.id)))}><BsTrash/></Button></th>
    </tr>
    );
  });

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

export default FilterTable;