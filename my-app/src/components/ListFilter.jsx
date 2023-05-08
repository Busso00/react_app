import { Button, ListGroup} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

function ListFilter(props) {
    const navigate = useNavigate();
  
    const listItems = props.filters.map((filter) => 
      <Button variant={props.active == filter ? "dark" : "light"} size="lg" key={"list-" + filter} onClick={() => navigate(`/filter/:${filter}`) }>{filter}</Button>
    );
    
    return (<ListGroup id="list-tab">{listItems}</ListGroup>);
  }

export default ListFilter;