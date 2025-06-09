import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';
import Problems from './pages/Problems/Problems';
import Tasks from './pages/Tasks/Tasks';
import Ranking from './pages/Ranking/Ranking';
import Store from './pages/Store';
import Cart from './pages/Cart';
import CreateProblem from './pages/CreateProblem';
import ProblemList from './pages/Problems/Page';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfileAndTeamPage from './pages/Team/TeamPage';
import Home from './pages/Home/Page';
import LandingPage from './pages/LandingPage/Page';
import { CartProvider } from './contexts/CartContext';
import GoogleReg from './pages/GoogleReg';
import ProfilePage from './pages/Profile/Page';
//import AdminDashboard from './pages/AdminPanel/AdminDashboard';
import Roadmap from './pages/Roadmap/Page';
import StoreManagement from './pages/StoreManagement';
import ImageUploaderCloudinary from './pages/ImageUploaderCloudinary';
import ManageUsers from './pages/ManageUsers';
import ManageProblems from './pages/ManageProblems';
import EditProfile from './pages/EditProfile/EditProfile';
import PurchaseManager from './pages/PurchaseManager';
import ReposLayout from './pages/Repositories/ReposLayout';
import Dashboard from './pages/Repositories/Dashboard/Page';
import Commits from './pages/Repositories/Commits/Page';
import PullRequests from './pages/Repositories/PullRequests/Page';
import RecommendedResources from './pages/Repositories/RecommendedResources/Page';
import BotStore from './pages/BotStore/Page';
import CommitFeedback from './pages/Repositories/Commits/CommitFeedback/Page';
import ReposListPage from './pages/Repositories/Page';
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import CreateTeamPage from "@/pages/Team/CreateTeamPage";
import JoinTeamPage from "@/pages/Team/JoinTeamPage";
import Achievements from './pages/Achievements/Page';
import AdminPanel from './pages/AdminPanel/Page';
import PullRequestFeedback from './pages/Repositories/PullRequests/PullRequestFeedback/Page';
import Intro from './pages/LandingPage/Intro';

// Layout con navbar
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
      <AuthProvider>
        <Router>
          <Routes>
            {/* Páginas sin navbar */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/landing-page" element={<LandingPage />} />
            <Route path="/GoogleReg" element={<GoogleReg />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/intro" element={<Intro />} />

            {/* Páginas con navbar */}
            <Route element={<LayoutConNavbar />}>
              <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
              <Route path="/manage-users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
              <Route path="/manage-problems" element={<AdminRoute><ManageProblems /></AdminRoute>} />
              <Route path="/problemList" element={<ProtectedRoute><ProblemList /></ProtectedRoute>} />
              <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
              <Route path="/problemList/problem/:problemId" element={<ProtectedRoute><Problems /></ProtectedRoute>} />
              <Route path="/problems" element={<ProtectedRoute><ProblemList /></ProtectedRoute>} />
              <Route path="/problems/create" element={<ProtectedRoute><CreateProblem /></ProtectedRoute>} />
              <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
              <Route path="/ranking" element={<ProtectedRoute><Ranking /></ProtectedRoute>} />
              <Route path="/store" element={<ProtectedRoute><Store /></ProtectedRoute>} />
              <Route path="/store/manage" element={<AdminRoute><StoreManagement /></AdminRoute>} />
              <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="/team" element={<ProtectedRoute><ProfileAndTeamPage /></ProtectedRoute>} />
              <Route path="/team/:teamId" element={<ProtectedRoute><ProfileAndTeamPage /></ProtectedRoute>} />
              <Route path="/test" element={<ProtectedRoute><ImageUploaderCloudinary /></ProtectedRoute>} />
              <Route path="/Profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/profile/view" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
              <Route path="/manage-purchase" element={<ProtectedRoute><PurchaseManager /></ProtectedRoute>} />
              <Route path="/teams/create" element={<ProtectedRoute><CreateTeamPage /></ProtectedRoute>} />
              <Route path="/teams/join" element={<ProtectedRoute><JoinTeamPage /></ProtectedRoute>} />
              <Route path="/bot-store" element={<ProtectedRoute><BotStore /></ProtectedRoute>} />
              <Route path="/repos" element={<ProtectedRoute><ReposListPage /></ProtectedRoute>} />

              <Route element={<ProtectedRoute><ReposLayout /></ProtectedRoute>}>
                <Route path="/repos/:repoFullName/Dashboard" element={<Dashboard />} />
                <Route path="/repos/:repoFullName/Commits" element={<Commits />} />
                <Route path="/repos/:repoFullName/PullRequests" element={<PullRequests />} />
                <Route path="/repos/:repoFullName/RecommendedResources" element={<RecommendedResources />} />
                <Route path="/repos/:repoFullName/Commits/:sha/feedback" element={<CommitFeedback />} />
                <Route path="/repos/:repoFullName/PullRequests/:pr_number/feedback" element={<PullRequestFeedback />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </CartProvider>
  );
}

export default App;