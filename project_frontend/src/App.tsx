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

import PullRequest from './pages/PullRequest'

import LandingPage from './pages/Landing'; // <-- Tu nueva página
import { CartProvider } from './contexts/CartContext';

// 1. Layout que incluye la Navbar
function LayoutConNavbar() {
  return (
    <div className="min-h-screen bg-[#1e1e1e]">
      <Navbar />
      {/* <Outlet /> renderiza la ruta hija */}
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
          <Route path="/landing" element={<LandingPage />} />

          {/* 3. Rutas que SÍ muestran la Navbar */}
          <Route element={<LayoutConNavbar />}>
            <Route path="/" element={<ProblemList />} />
            <Route path="/problemList" element={<ProblemList />} />
            <Route path="/problemList/problem/:problemId" element={<Problems />} />
            <Route path="/problems" element={<ProblemList />} />
            <Route path="/problems/create" element={<CreateProblem />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/code" element={<Code />} />
            <Route path="/code/detail/:id" element={<PullRequest />} /> {/* Add route for PullRequest */}
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/store" element={<Store />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;