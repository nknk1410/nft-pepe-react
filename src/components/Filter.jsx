import React from 'react'
import {  Button, Col, } from "react-bootstrap";

const Filter = () => {
  return (
    <>
    <Col>
        <Button variant="secondary ">All</Button>
        <Button variant="secondary mx-2">Wrapped</Button>
        <Button variant="secondary">UnWrapped</Button>
     </Col>

        <Col>
            API Resonse for sidebar Left
        </Col>
    <Col>
        Acordian list
    </Col>
  </>
  )
}

export default Filter