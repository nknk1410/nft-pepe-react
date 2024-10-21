import React from 'react'
import { Container } from 'react-bootstrap'
const Footer = () => {
  return (
      <footer className="bg-secondary text-white py-3 fixed-bottom bottom-0 z-50">
        <Container fluid >
          <p className="mb-0 text-center">© 2024 React Bootstrap. All rights reserved.</p>
        </Container>
      </footer>
  )
}

export default Footer