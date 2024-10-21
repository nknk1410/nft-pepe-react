import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
// Import urql and context provider
import { Provider, createClient,fetchExchange,cacheExchange} from 'urql';
import { PepeProvider } from './context/usePepeContext';


createRoot(document.getElementById('root')).render(
 <PepeProvider>
   <App />
</PepeProvider>
)
