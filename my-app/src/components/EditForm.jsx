import { Col , Row , Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import MyNavbar from './MyNavbar';
import ListFilter from './ListFilter';
import ModForm from './ModForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

function EditForm(props) {

  const id = parseInt(useParams().filmid.replace(":", ""))
  const modfilm = props.filmlibrary.films.find((fl) => { return fl.id == id; });
  if (!modfilm) {
    return <Alert variant='danger' onClose={() => closeForm()} dismissible>{"film ID not found"}</Alert>
  }

  return (
    <div className="container-fluid px-0">
      <MyNavbar/>
      <Row>
        <Col xs lg="3">
          <ListFilter filters={props.filters} />
        </Col>
        <Col>
          <ModForm modfilm={modfilm} filmlibrary={props.filmlibrary} setFilmlibrary={props.setFilmlibrary} />
        </Col>
      </Row>
    </div>
  );
}

export default EditForm;
