import './App.css'
import Layout from './components/Layout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Store from './pages/Store';
import Checkout from './components/Checkout';
import ProductView from './components/ProductView';

function App() {

  return (
    // <Layout>
      <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path='/store' element={<Store />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/product/:productId' element={<ProductView />} /> 
        {/* Other routes */}
      </Routes>
      </Router>
    // </Layout>
  )
}

export default App
