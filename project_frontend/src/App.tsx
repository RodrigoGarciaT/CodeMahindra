import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Problems from './pages/Problems';
import Tasks from './pages/Tasks';
import Code from './pages/Code';
import Ranking from './pages/Ranking';
import Store from './pages/Store';
import Cart from './pages/Cart';
import CreateProblem from './pages/CreateProblem';
import ProblemList from './pages/ProblemList';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TeamPage from './components/TeamPage';
import Dashboard from './components/Dashboard';
import LandingPage from './pages/LandingPage/Page'; // <-- Tu nueva página
import { CartProvider } from './contexts/CartContext';
import PullRequest from './pages/PullRequest';
import GoogleReg from './pages/GoogleReg';
import ProfilePage from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Roadmap from './pages/Roadmap';
import SpaceBackground from './components/SpaceBackground';
import StoreManagement from './pages/StoreManagement';
import ImageUploaderCloudinary from './pages/ImageUploaderCloudinary'
import ManageUsers from './pages/ManageUsers';
import ManageProblems from './pages/ManageProblems';
import EditProfile from './pages/EditProfile';
import PurchaseManager from './pages/PurchaseManager';

// 1. Layout que incluye la Navbar
function LayoutConNavbar() {
  return (
    <div className="min-h-screen bg-[#1e1e1e]">
      <Navbar />
      <Outlet /> {/* This will render the nested routes */}
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* 2. Ruta que NO muestra la Navbar (LandingPage) */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/GoogleReg" element={<GoogleReg />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* 3. Ruta con Navbar */}
          <Route element={<LayoutConNavbar />}>
            <Route path="/space" element={<SpaceBackground />} />
            <Route path="/" element={<Dashboard />} /> {/* Dashboard as default */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/manage-users" element={<ManageUsers />} />
            <Route path="/manage-problems" element={<ManageProblems />} />
            <Route path="/problemList" element={<ProblemList />} />
            <Route path="/roadmap" element={<Roadmap/>} />
            <Route path="/problemList/problem/:problemId" element={<Problems />} />
            <Route path="/problems" element={<ProblemList />} />
            <Route path="/problems/create" element={<CreateProblem />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/code" element={<Code />} />
            <Route path="/code/detail/:id" element={<PullRequest />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/store" element={<Store />} />
            <Route path="/store/manage" element={<StoreManagement />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/test" element={<ImageUploaderCloudinary />} />
            <Route path="/Profile" element={<ProfilePage />} />
            <Route path="/profile/view" element={<EditProfile />} />
            <Route path ='/manage-purchase' element = {<PurchaseManager/>} />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
