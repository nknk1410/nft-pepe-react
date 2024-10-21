import React, { useState, useEffect } from 'react';
import { useQuery } from 'urql';
import { usePepeContext } from '../context/usePepeContext';
import axios from 'axios'; // Import axios for API requests
import { Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import loaderImage from '../../public/loader2.gif';


const NFTsList = () => {
  const { address } = usePepeContext();  // Get the address from context

  // State to store additional API data (generation and image name)
  const [additionalData, setAdditionalData] = useState({});
  const stylebg = {
    backgroundColor: "#0F161B"
  };
  const nftsImage = "https://pepelords.com/wp-content/npepimg/";

  // GraphQL query with dynamic address
  
  const QUERY = `{
    pepes(where: { owner: "${address}" }) {
      mintedAt
      name
      tokenId
      uri
      owner {
        id
      }
      metadata {
        description
        image
        attributes {
          traitType
          value
        }
      }
      isWrapped
    }
  }`;




  const [result] = useQuery({ query: QUERY });
  const { data, fetching, error } = result;


  
  // Fetch generation and image name for each `pepe`
  useEffect(() => {
    if (data && data.pepes) {
       console.log('PepeTotal:',data.pepes.length);
      data.pepes.forEach((pepe) => {
        fetchAdditionalData(pepe.tokenId);
      });
    }
  }, [data]);

  // Function to fetch generation and image name
  const fetchAdditionalData = async (tokenId) => {
    try {
      const response = await axios.get(`https://api.reactapp.in/api/nfts-get-gen-img.php?token_id=${tokenId}&data=single`);
      if (response.data.status === 'success') {
        setAdditionalData(prevData => ({
          ...prevData,
          [tokenId]: response.data.data
        }));
      }
    } catch (error) {
      console.error(`Error fetching additional data for token ID: ${tokenId}`, error);
    }
  };

  // Group NFTs by Generation
  const groupByGeneration = (pepes) => {
    const groups = {};
    pepes.forEach(pepe => {
      const gen = additionalData[pepe.tokenId]?.trait_value8 || 'Unknown';
      if (!groups[gen]) {
        groups[gen] = [];
      }
      groups[gen].push(pepe);
    });
    return groups;
  };

  if (fetching) return <p> <img src={loaderImage} alt='Loading NFTs...' /></p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data || !data.pepes) return <p>No data found</p>;
  const groupedPepes = groupByGeneration(data.pepes);
  const totalPepes = data.pepes.length; // Total number of NFTs



  return (
      <Container fluid>
      <h6>NFTs for Owner: {address} [{totalPepes}]</h6>
      {/* Iterate over the grouped NFTs by generation */}
      {Object.keys(groupedPepes).map((gen, index) => (
        <div key={index}>
          <h4 className='my-3'>GEN: {gen} ({groupedPepes[gen].length})</h4>
          <Row className='row g-3'>
            {groupedPepes[gen].map((pepe, i) => (
              <div key={i} className="col-md-2">
                <div className='img-responsive'>
                  <img
                    src={
                      additionalData[pepe.tokenId]?.image_name
                        ? `${nftsImage}/${additionalData[pepe.tokenId].image_name}.svg`
                        : nftsImage
                    }
                    alt={pepe.name}
                  />
                </div>
                <div className='p-2' style={stylebg}>
                 
                 
                  <h6>Name: {pepe.name}</h6>
                  <h6>NFT Pepe ID: {pepe.tokenId}</h6>
                  <Link to={`/nft-details/${pepe.tokenId}`}>Name: {pepe.name}</Link>
                  <p className='d-none'><strong>Minted At:</strong> {pepe.mintedAt}</p>
                  <p className='d-none'><strong>Owner:</strong> {pepe.owner.id}</p>
                  {additionalData[pepe.tokenId] && (
                    <p><strong>GEN:</strong> {additionalData[pepe.tokenId].trait_value8}</p>
                  )}
                  <p><strong>Is Wrapped:</strong> {pepe.isWrapped ? "Wrapped" : "UnWrapped"}</p>
                </div>
              </div>
            ))}
        </Row>
        </div>
      ))}
    </Container>
  );
};

export default NFTsList;
