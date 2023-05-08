import { Navbar, Form, Nav } from 'react-bootstrap';
import { BsFilm, BsPersonCircle } from 'react-icons/bs';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

function MyNavbar(props) {
  
  return (
    <Navbar bg="dark" variant="dark" >
      <Navbar.Collapse>
        <Navbar.Brand className="mr-auto" href="index.html">
          <BsFilm className="navbarItem brand" />
          Film Library
        </Navbar.Brand>
        <Form className="m-auto">
          <Form.Control type="search" placeholder="Search" />
        </Form>
        <Nav className="ml-md-auto dark">
          <Nav.Item>
            <BsPersonCircle className="navbarItem login" />
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default MyNavbar;