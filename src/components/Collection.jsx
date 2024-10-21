import React from 'react'
import { useQuery } from 'urql';
//import { usePepeContext } from '../context/usePepeContext';
import { Link,useParams } from 'react-router-dom';

const Collection = () => {
   // const { address } = usePepeContext();  // Get the address from context
    const { address } = useParams();
    const nftsImage = " https://pepelords.com/wp-content/npepimg/QmdWbf16QgFSbdjnAomnMbmD39x7phAtLG7LBvgbdsDPJ7.svg";
    const stylebg = {
      backgroundColor: "#0F161B"
    };
  // GraphQL query with dynamic address
  const QUERY = `{
     pepes(first: 1000, skip: 0, where: { owner: "${address}"}) {
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


    if (fetching) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;


  return (
        <div>
      <h2>Your Collection ({data.pepes.length})</h2>
      {data.pepes.length > 0 ? (
        <div className="row">
          {data.pepes.map((pepe) => (
            <div key={pepe.tokenId} className="col-md-2">

            <div className='img-responsive'>
                  <img
                    src={`${nftsImage}` }
                    alt={pepe.name}
                  />
                </div>
              <div className='p-2' style={stylebg}>
                 <h6>Name: {pepe.name}</h6>
                 <h6>NFT Pepe ID: {pepe.tokenId}</h6>
                 <Link to={`/nft-details/${pepe.tokenId}`}>Name: {pepe.name}</Link>
                 <p><strong>Is Wrapped:</strong> {pepe.isWrapped ? "Wrapped" : "UnWrapped"}</p>
               </div>
       
            </div>
          
          ))}
        </div>
      ) : (
        <p>No NFTs found in this collection.</p>
      )}
    </div>
  );
};

export default Collection;


