import React from 'react'
import { Container, Navbar, Nav } from "react-bootstrap";
import { Link } from 'react-router-dom';

const Header = () => {
  return (
      <Navbar bg="secondary" variant="secondary"  expand="lg">
        <Container fluid >
          <Navbar.Brand  as={Link} href="/" style={{color:"#0ad939ed"}}>NFTs Pepes</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link  as={Link}  to="/">Home</Nav.Link>
              <Nav.Link  as={Link}  to="/collection">Collection</Nav.Link>
              <Nav.Link  as={Link}  to="/all-pepes">All Nfts</Nav.Link>
              <Nav.Link  as={Link}  to="/about">About</Nav.Link>
              <Nav.Link  as={Link}  to="/contact">Contact</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  )
}

export default Header