import "./App.css";
import Layout from "./components/Layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login, Signup, Logout, OAuthSuccess } from "./pages/Auth";
import Store from "./pages/Store/index";
import Checkout from "./pages/Store/Checkout";
import ProductView from "./components/Store/ProductView";
import Trainers from "./pages/Trainers";
import Explore from "./pages/Explore";
import Schedule from "./pages/Schedule";
import MealPlan from "./pages/MealPlan";
import Chat from "./pages/Chat";
import Subscription from "./pages/Subscription";
import TrainerProfile from "./pages/TrainerProfile";
import Calculators from "./pages/Calculator/Calculators";
import CustomSchedules from "./pages/Calculator/CustomSchedules";
import AddSchedule from "./pages/Calculator/AddSchedule";
import EditSchedule from "./pages/Calculator/EditSchedule";
import ViewSchedule from "./pages/Calculator/ViewSchedule";
import SearchExercisesPage from "./pages/Calculator/SearchExercisesPage";
import FitnessCalculators from "./pages/Calculator/FitnessCalculators";
import Exercise from "./pages/Calculator/Exercises";
import Reports from "./pages/Calculator/Reports";
import Community from "./pages/Community";
import UserProvider from "./context/UserContext";
import FitnessProfileProvider from "./context/FitnessProfileContext";
import Home from "./pages/Home";
import { NavigationProvider } from "./context/NavigationContext";
import { SocketProvider } from "./context/SocketContext";

function App() {
  return (
    <UserProvider>
      <SocketProvider>
        <FitnessProfileProvider>
          <Router>
            <NavigationProvider>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/oauth-success" element={<OAuthSuccess />} />
                <Route path="/store" element={<Store />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/product/:productId" element={<ProductView />} />
                <Route path="/trainers" element={<Trainers />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/schedule/:trainerId" element={<Schedule />} />
                <Route path="/meal-plan/:trainerId" element={<MealPlan />} />
                <Route path="/chat/:trainerId" element={<Chat />} />
                <Route path="/subscription/:trainerId" element={<Subscription />} />
                <Route path="/trainer-profile/:trainerId" element={<TrainerProfile />} />
                <Route path="/calculators" element={<Calculators />} />
                <Route path="/custom-schedules" element={<CustomSchedules />} />
                <Route path="/add-schedule" element={<AddSchedule />} />
                <Route path="/edit-schedule/:scheduleId" element={<EditSchedule />} />
                <Route path="/view-schedule/:scheduleId" element={<ViewSchedule />} />
                <Route path="/search-exercises" element={<SearchExercisesPage />} />
                <Route path="/fitness-calculators" element={<FitnessCalculators />} />
                <Route path="/exercise" element={<Exercise />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/community" element={<Community />} />
              </Routes>
            </NavigationProvider>
          </Router>
        </FitnessProfileProvider>
      </SocketProvider>
    </UserProvider>
  );
}

export default App;