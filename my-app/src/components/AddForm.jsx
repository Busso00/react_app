import { Col, Row } from 'react-bootstrap';
import MyNavbar from './MyNavbar';
import ListFilter from './ListFilter';
import ModForm from './ModForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

function AddForm(props) {

  return (
    <div className="container-fluid px-0">
      <MyNavbar />
      <Row>
        <Col xs lg="3">
          <ListFilter filters={props.filters} />
        </Col>
        <Col >
          <ModForm filmlibrary={props.filmlibrary} setFilmlibrary={props.setFilmlibrary} id={props.id} incrId={props.incrId} />
        </Col>
      </Row>
    </div>
  );
}

export default AddForm;
