import './App.css'
import Layout from './components/Layout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
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
import Calculators from './pages/Calculators';
import CustomSchedules from './pages/CustomSchedules';
import AddSchedule from './pages/AddSchedule';
import EditSchedule from './pages/EditSchedule';
import ViewSchedule from './pages/ViewSchedule';
import SearchExercisesPage from './pages/SearchExercisesPage';
import FitnessCalculators from './pages/FitnessCalculators';
import Exercise from './pages/Exercises';
import UserProvider from './context/UserContext';



function App() {

  return (
    // <Layout>
    <UserProvider>
      <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
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
        <Route path='/calculators' element={<Calculators />} />
        <Route path='/custom-schedules' element={<CustomSchedules />} />
        <Route path="/add-schedule" element={<AddSchedule />} />
        <Route path="/edit-schedule/:scheduleId" element={<EditSchedule />} />
        <Route path="/view-schedule/:scheduleId" element={<ViewSchedule />} />
        <Route path="/search-exercises" element={<SearchExercisesPage />} />
        <Route path="/fitness-calculators" element={<FitnessCalculators />} />
        <Route path="/exercise" element={<Exercise />} />
        {/* Other routes */}
      </Routes>
      </Router>
      </UserProvider>
    // </Layout>
  )
}

export default App
