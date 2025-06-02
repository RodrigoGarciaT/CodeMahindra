import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';
import Problems from './pages/Problems/Page';
import Tasks from './pages/Tasks/Tasks';
import Ranking from './pages/Ranking/Ranking';
import Store from './pages/Store';
import Cart from './pages/Cart';
import CreateProblem from './pages/CreateProblem';
import ProblemList from './pages/ProblemList';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TeamPage from './pages/TeamPage';
import Home from './pages/Home/Page';
import LandingPage from './pages/LandingPage/Page';
import { CartProvider } from './contexts/CartContext';
import GoogleReg from './pages/GoogleReg';
import ProfilePage from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Roadmap from './pages/Roadmap/Page';
import StoreManagement from './pages/StoreManagement';
import ImageUploaderCloudinary from './pages/ImageUploaderCloudinary'
import ManageUsers from './pages/ManageUsers';
import ManageProblems from './pages/ManageProblems';
import EditProfile from './pages/EditProfile';
import PurchaseManager from './pages/PurchaseManager';
import ReposLayout from './pages/Repositories/ReposLayout';
import Dashboard from './pages/Repositories/Dashboard/Page';
import Commits from './pages/Repositories/Commits/Page';
import PullRequests from './pages/Repositories/PullRequests/Page';
import RecommendedResources from './pages/Repositories/RecommendedResources/Page';
import BotStore from './pages/Home/BotStore';
import CommitFeedback from './pages/Repositories/Commits/CommitFeedback/Page';
import ReposListPage from './pages/Repositories/Page';

// 1. Layout que incluye la Navbar
function LayoutConNavbar() {
  return (
    <div className="min-h-screen bg-[#1e1e1e]">
      <Navbar />
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* 2. Ruta que NO muestra la Navbar (LandingPage) */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing-page" element={<LandingPage />} />
          <Route path="/GoogleReg" element={<GoogleReg />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* 3. Ruta con Navbar */}
          <Route element={<LayoutConNavbar />}>
          
            <Route path="/home" element={<Home />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/manage-users" element={<ManageUsers />} />
            <Route path="/manage-problems" element={<ManageProblems />} />
            <Route path="/problemList" element={<ProblemList />} />
            <Route path="/roadmap" element={<Roadmap/>} />
            <Route path="/problemList/problem/:problemId" element={<Problems />} />
            <Route path="/problems" element={<ProblemList />} />
            <Route path="/problems/create" element={<CreateProblem />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/store" element={<Store />} />
            <Route path="/store/manage" element={<StoreManagement />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/test" element={<ImageUploaderCloudinary />} />
            <Route path="/Profile" element={<ProfilePage />} />
            <Route path="/profile/view" element={<EditProfile />} />
            <Route path ='/manage-purchase' element = {<PurchaseManager/>} />
            <Route path ='/repos' element = {<ReposListPage />} />

            <Route element={<ReposLayout />}>
              <Route path="/repos/:repoFullName/Dashboard" element={<Dashboard />} />
              <Route path="/repos/:repoFullName/Commits" element={<Commits />} />
              <Route path="/repos/:repoFullName/PullRequests" element={<PullRequests />} />
              <Route path="/repos/:repoFullName/RecommendedResources" element={<RecommendedResources />} />
              <Route path="/repos/:repoFullName/commits/:sha/feedback" element={<CommitFeedback />} />
            </Route>

            <Route path="/bot-store" element={<BotStore />} />
          
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
