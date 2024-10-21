import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Form } from "react-bootstrap";
import { usePepeContext } from '../context/usePepeContext';
import { useNavigate,useParams } from 'react-router-dom'; 

const InputForm = ({currentPage}) => {
const { address: urlAddress } = useParams(); 
const [inputValue, setInputValue] = useState(urlAddress || ''); 
//const [inputValue, setInputValue] = useState('');
const {setAddress} = usePepeContext();
const navigate = useNavigate();


useEffect(() => {
  if (urlAddress) {
    setAddress(urlAddress.toLowerCase());
  }
}, [urlAddress, setAddress])


const handleSubmit = (e) => {
  e.preventDefault();
  const lowerCaseAddress = inputValue.toLowerCase();
  setAddress(lowerCaseAddress); 
  console.log('currentPage : ', currentPage)
  if (currentPage === 'collection') {
    navigate(`/collection/${lowerCaseAddress}`);
  }else if(currentPage === 'all-pepes'){
    navigate(`/all-pepes/${lowerCaseAddress}`);
  } else {
    navigate(`/${lowerCaseAddress}`);
  }
};


  return (
    <Form onSubmit={handleSubmit}>
    <Form.Group controlId="formBasicInput">
    <Row>
      <Col md={2} className="text-lg-end my-2"> <Form.Label className="mb-0 pt-2">Enter Address</Form.Label></Col>
      <Col md={8}>
      <Form.Control className="my-2"
        type="text"
        placeholder="Type Address"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      </Col>
      <Col md={2}>
      <Button variant="secondary " className="my-2 w-100" type="submit">
        Submit
      </Button>
      
      </Col>
      </Row>
    </Form.Group>
 </Form>
  )
}

export default InputForm