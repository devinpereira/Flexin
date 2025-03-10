import './App.css'
import Layout from './components/Layout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Store from './pages/Store';

function App() {

  return (
    // <Layout>
      <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path='/store' element={<Store />} />
        {/* Other routes */}
      </Routes>
      </Router>
    // </Layout>
  )
}

export default App
