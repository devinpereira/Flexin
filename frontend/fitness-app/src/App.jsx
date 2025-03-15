import './App.css'
import Layout from './components/Layout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Store from './pages/Store';
import Checkout from './components/Checkout';
import ProductView from './components/ProductView';
import Trainers from './pages/Trainers';
import Explore from './pages/Explore';
import Schedule from './pages/Schedule';
import MealPlan from './pages/MealPlan';
import Chat from './pages/Chat';
import Subscription from './pages/Subscription';
import TrainerProfile from './pages/TrainerProfile';

function App() {

  return (
    // <Layout>
      <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path='/store' element={<Store />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/product/:productId' element={<ProductView />} /> 
        <Route path='/trainers' element={<Trainers />} />
        <Route path='/explore' element={<Explore />} />
        <Route path='/schedule/:trainerId' element={<Schedule />} />
        <Route path='/meal-plan/:trainerId' element={<MealPlan />} />
        <Route path='/chat/:trainerId' element={<Chat />} />
        <Route path='/subscription/:trainerId' element={<Subscription />} />
        <Route path='/trainer-profile/:trainerId' element={<TrainerProfile />} />
        {/* Other routes */}
      </Routes>
      </Router>
    // </Layout>
  )
}

export default App
