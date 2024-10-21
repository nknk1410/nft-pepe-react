import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Filter from "./components/Filter";
import NFTsList from "./components/NFTsList";
import InputForm from "./components/InputForm";

import NFTDetails from "./components/NFTDetails";
import About from "./components/pages/About";
import Contact from "./components/pages/Contact";
import Collection from "./components/Collection";
import AllNnts from "./components/AllNFTs";


function App() {

  return (
    <Router>
    <Header />
          <Routes>
            <Route path="/:address?" 
                element={
                      <Container fluid className="py-5 bg-dark text-light">
                          <Row>
                                <Col md={3} className="py-2 border">
                                  <Filter />  
                                </Col>
                                <Col md={9} className="border">
                                  <InputForm /> 
                                  <NFTsList /> 
                                </Col>
                          </Row>
                        </Container>
                    }
              />

            <Route path="/all-pepes/:address?" 
                element={
                      <Container fluid className="py-5 bg-dark text-light">
                          <Row>
                                <Col md={3} className="py-2 border">
                                  <Filter />  
                                </Col>
                                <Col md={9} className="border">
                                  <InputForm  currentPage="all-pepes" /> 
                                  <AllNnts/>
                                </Col>
                          </Row>
                        </Container>
                    }
              />


             <Route path="/collection/:address" 
                element={
                      <Container fluid className="py-5 bg-dark text-light">
                          <Row>
                                <Col md={3} className="py-2 border">
                                  <Filter />  
                                </Col>
                                <Col md={9} className="border">
                                  <InputForm currentPage="collection" /> 
                                  <Collection /> 
                                </Col>
                          </Row>
                        </Container>
                    }
              />   
           <Route path="/nft-details/:tokenId" element={<NFTDetails />} /> 
  
           <Route path="/about" element={<About />} /> 
           <Route path="/contact" element={<Contact />} /> 
          </Routes>
    <Footer />
  </Router>
  );
}

export default App;
// 33e4143808a5f46f523fc8d671bc5d7e