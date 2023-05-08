import { Col, Row, Button } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import ListFilter from './ListFilter';
import FilterTable from './FilterTable';
import MyNavbar from './MyNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

function VisualizeFilms(props) {

  let active = props.active || useParams().active.replace(":", "");

  return (
    <div className="container-fluid px-0">
      <MyNavbar />
      <Row>
        <Col xs lg="3">
          <ListFilter filters={Object.keys(props.actions)} active={active} />
        </Col>
        <Col>
          <h1>{active}</h1>
          <FilterTable films={props.actions[active](props.filmlibrary)} filmlibrary={props.filmlibrary} setFilmlibrary={props.setFilmlibrary} />
          <Link to="/add" ><Button variant={'primary'} className="rounded-circle" >+</Button></Link>
        </Col>
      </Row>
    </div>
  );
}

export default VisualizeFilms;