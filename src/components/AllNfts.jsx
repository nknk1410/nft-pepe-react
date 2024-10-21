import React, { useState, useEffect, useMemo } from 'react';
import { usePepeContext } from '../context/usePepeContext';
import { useParams } from 'react-router-dom';
import { Container, Row } from 'react-bootstrap';
import loaderImage from '../../public/loader2.gif';


//https://pepelords.com/npepcore/graphQL_all_nfts_api.php?page=2&limit=1000&wrappedStatus=wrapped
//https://pepelords.com/npepcore/graphQL_all_nfts_api.php?page=2&limit=1000&wrappedStatus=all&owner=0x30385a99e66469a8c0bf172896758dd4595704a9

// Dynamic QUERY function that considers address
const QUERY = (address) => `
  query GetPepes($first: Int, $skip: Int${address ? ", $owner: String" : ""}) {
    pepes(first: $first, skip: $skip${address ? ", where: { owner: $owner }" : ""}) {
      isWrapped
      mintedAt
      name
      tokenId
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
 
    }
  }
`;
//QmW6LVBGE8VKsimTtn3dBctVzAxcyzvJAGCNrm5n1pPgde
const AllNfts = () => {
  const [nftCount, setNftCount] = useState(0);
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { address: contextAddress } = usePepeContext(); // Context hook
  const { address: urlAddress } = useParams(); // Get address from URL params
  const nftsImage = 'https://pepelords.com/wp-content/npepimg/QmdWbf16QgFSbdjnAomnMbmD39x7phAtLG7LBvgbdsDPJ7.svg';

  // Determine the address to use (from context or URL)
  const address = contextAddress || urlAddress;
//https://gateway-arbitrum.network.thegraph.com/api/4679dbb29bbfaae74b4b367dca323523/subgraphs/id/FPMxkMhLotXiJC5XpQbqzLKmT1rre24NAmQ9bAAYPfrQ
  // Memoized fetch function to prevent re-fetching if address doesn't change
  const fetchNftsBatch = useMemo(
    () => async (skip) => {
      try {
        const response = await fetch('https://gateway.thegraph.com/api/33e4143808a5f46f523fc8d671bc5d7e/subgraphs/id/FPMxkMhLotXiJC5XpQbqzLKmT1rre24NAmQ9bAAYPfrQ', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: QUERY(address), // Pass the address to the query function
            variables: {
              first: 500,
              skip: skip,
              ...(address ? { owner: address.toLowerCase() } : {}), // Add the address only if it's provided
            },
          }),
        });

        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const result = await response.json();
        return result.data ? result.data.pepes : [];
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        return [];
      }
    },
    [address]
  );

  const fetchAllNfts = async () => {
    let allNfts = [];
    let skip = 0;
    let hasMore = true;
    const concurrentRequests = 12; // Number of concurrent requests

    while (hasMore) {
      // Create an array of promises for concurrent fetching
      const promises = Array.from({ length: concurrentRequests }, (_, i) =>
        fetchNftsBatch(skip + i * 500)
      );
      
      const results = await Promise.all(promises);
      const batch = results.flat();

      if (batch.length > 0) {
        allNfts = [...allNfts, ...batch];
        skip += concurrentRequests * 500; // Increment skip by the total fetched
      } else {
        hasMore = false; // No more data to fetch
      }
    }

    setNfts(allNfts);
    setNftCount(allNfts.length);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllNfts();
  }, [address]);

  if (loading) {
    return (
      <div>
        <img src={loaderImage} alt='Loading NFTs...' />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const getGeneration = (metadata) => {
    if (metadata && metadata.attributes) {
      const generationAttribute = metadata.attributes.find(
        (attr) => attr.traitType === 'Generation'
      );
      return generationAttribute ? generationAttribute.value : 'Unknown';
    }
    return 'No metadata';
  };



  return (
    <Container fluid>
      <h5>Total NFTs: {nftCount}</h5> {/* Display the total count */}
      <Row>
        {nfts.map((nft, index) => (
          <div key={index} className="col-md-2">
            <img
              src={`${nftsImage}`}
              alt={nft.name}
            />
            <h6>Name: {nft.name}</h6>
            <h6>Token ID: {nft.tokenId}</h6>
            GEN: {getGeneration(nft.metadata)}
            <p><strong>Is Wrapped:</strong> {nft.isWrapped ? 'Wrapped' : 'Unwrapped'}</p>
          </div>
        ))}
      </Row>
    </Container>
  );
};

export default AllNfts;
