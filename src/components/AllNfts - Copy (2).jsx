import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useClient } from 'urql';
import { Container, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const AllNfnts = () => {
  const { address } = useParams();
  const client = useClient();
  const [nfts, setNfts] = useState([]);
  const [additionalData, setAdditionalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const batchSize = 1000; // Reduced for example purposes
  const totalNFTs = 5418;
  const observer = useRef();
  const loadMoreRef = useRef();
  const nftsImage = "https://pepelords.com/wp-content/npepimg/";

  // Fetch NFTs with urql client directly
  const fetchNFTs = async () => {
    const QUERY = `{
      pepes(first: ${batchSize}, skip: ${page * batchSize}${address ? `, where: { owner: "${address}" }` : ''}) {
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

    const result = await client.query(QUERY).toPromise();
    console.log('result:', result);

    
    if (result.error) {
      console.error(`Error fetching NFTs: ${result.error.message}`);
      return;
    }

    setNfts((prev) => [...prev, ...(result.data.pepes || [])]);
    setLoading(false);
  };

  useEffect(() => {
    fetchNFTs();
  }, [page, address]);

  // Fetch additional data for each NFT
  useEffect(() => {
    if (nfts.length > 0) {
      nfts.forEach((pepe) => fetchAdditionalData(pepe.tokenId));
    }
  }, [nfts]);

  const fetchAdditionalData = async (tokenId) => {
    try {
      const response = await axios.get(
        `https://api.reactapp.in/api/nfts-get-gen-img.php?token_id=${tokenId}&data=single`
      );
      if (response.data.status === 'success') {
        setAdditionalData((prevData) => ({
          ...prevData,
          [tokenId]: response.data.data,
        }));
      }
    } catch (error) {
      console.error(`Error fetching additional data for token ID: ${tokenId}`, error);
    }
  };

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && nfts.length < totalNFTs) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, nfts.length, totalNFTs]
  );

  const groupByGeneration = (pepes) => {
    const groups = {};
    pepes.forEach((pepe) => {
      const gen = additionalData[pepe.tokenId]?.trait_value8 || 'Unknown';
      if (!groups[gen]) {
        groups[gen] = [];
      }
      groups[gen].push(pepe);
    });

    // Sort the groups by generation
    const sortedKeys = Object.keys(groups).sort((a, b) => parseInt(a) - parseInt(b));
    return sortedKeys.reduce((sortedGroups, key) => {
      sortedGroups[key] = groups[key];
      return sortedGroups;
    }, {});
  };

  if (loading) return <p>Loading NFTs...</p>;
  if (!nfts.length) return <p>No NFTs found</p>;

  const groupedPepes = groupByGeneration(nfts);

  return (
    <Container fluid>
      <h6>NFTs for Owner: {address ? address : 'All'} [{nfts.length}]</h6>
      {Object.keys(groupedPepes).map((gen, index) => (
        <div key={index}>
          <h4 className="my-3">GEN: {gen} ({groupedPepes[gen].length})</h4>
          <Row className="row g-3">
            {groupedPepes[gen].map((pepe, i) => (
              <div
                key={i}
                className="col-md-2"
                ref={i === groupedPepes[gen].length - 1 ? lastElementRef : null}
              >
                <div className="img-responsive">
                  <img
                    src={
                      additionalData[pepe.tokenId]?.image_name
                        ? `${nftsImage}/${additionalData[pepe.tokenId].image_name}.svg`
                        : nftsImage
                    }
                    alt={pepe.name}
                  />
                </div>
                <div className="p-2" style={{ backgroundColor: "#0F161B" }}>
                  <h6>Name: {pepe.name}</h6>
                  <h6>NFT Pepe ID: {pepe.tokenId}</h6>
                  <Link to={`/nft-details/${pepe.tokenId}`}>View Details</Link>
                  {additionalData[pepe.tokenId] && (
                    <p>
                      <strong>GEN:</strong> {additionalData[pepe.tokenId].trait_value8}
                    </p>
                  )}
                  <p><strong>Is Wrapped:</strong> {pepe.isWrapped ? 'Wrapped' : 'Unwrapped'}</p>
                </div>
              </div>
            ))}
          </Row>
        </div>
      ))}
      <div ref={loadMoreRef}></div>
    </Container>
  );
};

export default AllNfnts;
