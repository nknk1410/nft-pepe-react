  import React, { createContext, useContext, useState } from "react";
  import { cacheExchange, createClient, fetchExchange, Provider as UrqlProvider } from "urql";


  const PepeContext = createContext();
  
  export const usePepeContext = () => useContext(PepeContext);
  
  // Create the provider component
  export const PepeProvider = ({ children }) => {
    const [address, setAddress] = useState("");
  
 // Create urql client inside the context
 const client = createClient({
  url: 'https://gateway.thegraph.com/api/33e4143808a5f46f523fc8d671bc5d7e/subgraphs/id/FPMxkMhLotXiJC5XpQbqzLKmT1rre24NAmQ9bAAYPfrQ',
  exchanges: [cacheExchange, fetchExchange],
});


    return (
      <PepeContext.Provider value={{ address, setAddress }}>
        <UrqlProvider value={client}>
          {children}
        </UrqlProvider>
      </PepeContext.Provider>
    );
  };
  