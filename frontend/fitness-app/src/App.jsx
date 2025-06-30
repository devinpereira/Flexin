import "./App.css";
import Layout from "./components/Layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login, Signup, Logout, OAuthSuccess } from "./pages/Auth";
import Store from "./pages/Store/index";
import Checkout from "./pages/Store/Checkout";
import ProductView from "./components/Store/ProductView";
import {
  Trainers,
  Explore,
  Schedule,
  MealPlan,
  Chat,
  Subscription,
  TrainerProfile
} from "./pages/Trainers";
import Calculators from "./pages/Calculator/Calculators";
import CustomSchedules from "./pages/Calculator/CustomSchedules";
import AddSchedule from "./pages/Calculator/AddSchedule";
import EditSchedule from "./pages/Calculator/EditSchedule";
import ViewSchedule from "./pages/Calculator/ViewSchedule";
import SearchExercisesPage from "./pages/Calculator/SearchExercisesPage";
import FitnessCalculators from "./pages/Calculator/FitnessCalculators";
import Exercise from "./pages/Calculator/Exercises";
import Reports from "./pages/Calculator/Reports";
import UserProvider from "./context/UserContext";
import FitnessProfileProvider from "./context/FitnessProfileContext";
import Home from "./pages/Home";
import { NavigationProvider } from "./context/NavigationContext";
import { SocketProvider } from "./context/SocketContext";
import CommunityHome from "./pages/Community/Home";
import CommunitySearch from "./pages/Community/Search";
import CommunityNotifications from "./pages/Community/Notifications";
import CommunityFriends from "./pages/Community/Friends";
import CommunityProfile from "./pages/Community/Profile";

// Import Admin pages
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminTrainers from "./pages/Admin/Trainers";
import AdminEditTrainer from "./pages/Admin/Trainers/EditTrainer";
import AdminApproveTrainers from "./pages/Admin/Trainers/ApproveTrainers";
import AdminTrainerPayments from "./pages/Admin/Trainers/Payments";
import AdminTrainerReports from "./pages/Admin/Trainers/Reports";
import AdminStore from "./pages/Admin/Store";
import AdminProducts from "./pages/Admin/Store/Products";
import AdminAddProduct from "./pages/Admin/Store/AddProduct";
import AdminEditProduct from "./pages/Admin/Store/EditProduct";
import AdminOrders from "./pages/Admin/Store/Orders";
import AdminOrderDetails from "./pages/Admin/Store/OrderDetails";
import AdminInventory from "./pages/Admin/Store/Inventory";
import AdminCommunity from "./pages/Admin/Community";
import AdminFitness from "./pages/Admin/Fitness";
import AdminAddExercise from "./pages/Admin/Fitness/AddExercise";
import AdminEditExercise from "./pages/Admin/Fitness/EditExercise";
import AdminSettings from "./pages/Admin/Settings";
import AdminProductView from "./pages/Admin/Store/ProductView";

import { NotificationProvider } from "./context/NotificationContext";

import PrivateRoute from "./guards/PrivateRoutes";
import PublicRoute from "./guards/PublicRoutes";

function App() {
  return (
    <UserProvider>
      <SocketProvider>
        <FitnessProfileProvider>
          <NotificationProvider>
            <Router>
              <NavigationProvider>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/logout" element={<Logout />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/oauth-success" element={<OAuthSuccess />} />
                  </Route>
                    <Route element={<PrivateRoute />}>
                    <Route path="/store" element={<Store />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/product/:productId" element={<ProductView />} />
                    <Route path="/trainers/my-trainers" element={<Trainers />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/schedule/:trainerId" element={<Schedule />} />
                    <Route path="/meal-plan/:trainerId" element={<MealPlan />} />
                    <Route path="/chat/:trainerId" element={<Chat />} />
                    <Route path="/subscription/:trainerId" element={<Subscription />} />
                    <Route path="/trainers/:trainerId" element={<TrainerProfile />} />
                    <Route path="/calculators" element={<Calculators />} />
                    <Route path="/custom-schedules" element={<CustomSchedules />} />
                    <Route path="/add-schedule" element={<AddSchedule />} />
                    <Route path="/edit-schedule/:scheduleId" element={<EditSchedule />} />
                    <Route path="/view-schedule/:scheduleId" element={<ViewSchedule />} />
                    <Route path="/search-exercises" element={<SearchExercisesPage />} />
                    <Route path="/fitness-calculators" element={<FitnessCalculators />} />
                    <Route path="/exercise" element={<Exercise />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/community/home" element={<CommunityHome />} />
                    <Route path="/community/search" element={<CommunitySearch />} />
                    <Route path="/community/notifications" element={<CommunityNotifications />} />
                    <Route path="/community/friends" element={<CommunityFriends />} />
                    <Route path="/community/profile" element={<CommunityProfile />} />
                    <Route path="/community/profile/:userId" element={<CommunityProfile />} />
                    <Route path="/community/create" element={<CommunityHome />} />
                  </Route>
                  {/* Admin Routes */}
                  <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/trainers" element={<AdminTrainers />} />
                    <Route path="/admin/trainers/edit-trainer" element={<AdminEditTrainer />} />
                    <Route path="/admin/trainers/approve-trainers" element={<AdminApproveTrainers />} />
                    <Route path="/admin/trainers/payments" element={<AdminTrainerPayments />} />
                    <Route path="/admin/trainers/reports" element={<AdminTrainerReports />} />
                    <Route path="/admin/store" element={<AdminStore />} />
                    <Route path="/admin/store/products" element={<AdminProducts />} />
                    <Route path="/admin/store/products/add" element={<AdminAddProduct />} />
                    <Route path="/admin/store/products/edit/:productId" element={<AdminEditProduct />} />
                    <Route path="/admin/store/products/view/:productId" element={<AdminProductView />} />
                    <Route path="/admin/store/orders" element={<AdminOrders />} />
                    <Route path="/admin/store/orders/:orderId" element={<AdminOrderDetails />} />
                    <Route path="/admin/store/inventory" element={<AdminInventory />} />
                    <Route path="/admin/community" element={<AdminCommunity />} />
                    <Route path="/admin/fitness" element={<AdminFitness />} />
                    <Route path="/admin/fitness/add-exercise" element={<AdminAddExercise />} />
                    <Route path="/admin/fitness/edit-exercise" element={<AdminEditExercise />} />
                    <Route path="/admin/settings" element={<AdminSettings />} />
                  </Route>

                  {/* Fallback route for unauthorized access */}
                  <Route path="/unauthorized" element={<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0A0A1F] to-[#1A1A2F]">
                    <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-8 max-w-md text-center">
                      <h1 className="text-white text-2xl font-bold mb-4">Access Denied</h1>
                      <p className="text-white/70 mb-6">You don't have permission to access this page.</p>
                      <button
                        onClick={() => window.history.back()}
                        className="bg-[#f67a45] text-white px-4 py-2 rounded-lg hover:bg-[#e56d3d]"
                      >
                        Go Back
                      </button>
                    </div>
                  </div>} />
                </Routes>
              </NavigationProvider>
            </Router>
          </NotificationProvider>
        </FitnessProfileProvider>
      </SocketProvider>
    </UserProvider>
  );
}

export default App;