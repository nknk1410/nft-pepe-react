import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Col, Container, Row } from 'react-bootstrap';
import { useQuery } from 'urql';


const QUERY = (tokenId) => `
{
  pepes(where: {tokenId: ${tokenId}}) {
    isWrapped
    mintedAt
    name
    named
    tokenId
    owner {
      id
    }
  }
}`;




const NFTDetails = () => {
  const { tokenId } = useParams();  // Get tokenId from URL params
  const [nftDetails, setNftDetails] = useState(null);

  const nftsImage = "https://pepelords.com/wp-content/npepimg/";

  useEffect(() => {
    
    const fetchNFTDetails = async () => {
      try {
        const response = await axios.get(`https://api.reactapp.in/api/nfts-get-gen-img.php?token_id=${tokenId}&data=all`);
        if (response.data.status === 'success') {
          setNftDetails(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching NFT details:', error);
      }
    };

    fetchNFTDetails();
  }, [tokenId]);


  // GraphQL query to fetch additional NFT details
  const [result] = useQuery({ query: QUERY(Number(tokenId)) });
  const { data: graphqlData, fetching, error } = result;

  if (fetching) return <p>Loading NFT details...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;

  if (!nftDetails) {
    return <p>Loading...</p>;
  }

  return (
    <section className='bg-dark text-light'>
    <Container className='py-5'>
    <Row>
     <Col md={5} lg={5} sm={12}>
            <div className='img-responsive'>
                <img className='img-fluid'
                src={`https://pepelords.com/wp-content/npepimg/${nftDetails.image_name}.svg`}
                alt={nftDetails.name}
                />
            </div>
     </Col>

     <Col md={7} lg={7} sm={12}>

  <h3>{nftDetails.pepe_token_name}</h3>
  <p className='mb-0'><strong>Token ID: {tokenId}</strong></p>
  {graphqlData?.pepes?.length > 0 && (
    <div>
      <p className='mb-0'><strong>Status: {graphqlData.pepes[0].isWrapped}</strong></p>
      <p  className='mb-0'><strong>Minted At: {new Date(graphqlData.pepes[0].mintedAt * 1000).toLocaleString()}</strong></p>
      <p  className='mb-0'><strong>Owner ID: {graphqlData.pepes[0].owner.id}</strong></p>
    </div>
  )}
<p>Description : {nftDetails.bio_description }</p>
      <h4>Traits: </h4>
    
          <Row className='text-center'>
            {[...Array(9)].map((_, index) => (
              <Col key={index} md={4} className='border'>
                <p>{nftDetails[`trait_type${index + 1}`]} <br /> {nftDetails[`trait_value${index + 1}`]}</p>
              </Col>
            ))}
          </Row>

     </Col>
      </Row>
    </Container>
    </section>
  );
};




export default NFTDetails;
