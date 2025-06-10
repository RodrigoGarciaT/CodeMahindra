import { Link, useLocation } from 'react-router-dom';
import {
  Home, Code2, Trophy, ShoppingBag, Bell, ShoppingCart, ListTodo, Settings, Menu, GithubIcon
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import UserMenu from './UserMenu';
import logo from '../images/logo-codemahindra.png';
import { useState } from 'react';

const Navbar = () => {
  const { itemCount } = useCart();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { icon: "🚀", message: "New Pull Request analysis available", time: "2m ago" },
    { icon: "🏆", message: "You've unlocked the 'Bug Hunter' achievement!", time: "10m ago" },
    { icon: "🧠", message: "You solved the problem 'Two Sum'", time: "30m ago" },
    { icon: "📈", message: "You leveled up to Level 3!", time: "1h ago" },
    { icon: "✅", message: "Task 'Fix login bug' completed", time: "2h ago" },
  ];

  // Obtenemos usuario desde localStorage
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  const isAdmin = user?.isAdmin === true;


  const navItems = [
    { path: '/home', label: 'Home', icon: <Home className="h-4 w-4 mr-1" />, includes: ["/home", "/profile", "/team", "/achievements", "/bot-store"] },
    { path: '/problems', label: 'Problems', icon: <Code2 className="h-4 w-4 mr-1" />, includes: ["/problems", "/roadmap", "/problemList/problem"] },
    { path: '/tasks', label: 'Tasks', icon: <ListTodo className="h-4 w-4 mr-1" /> },
    { path: '/repos', label: 'Repositories', icon: <GithubIcon className="h-4 w-4 mr-1" />, includes: ["/repos", "/Dashboard", "/Commits", "/PullRequests", "/RecommendedResources"] },
    { path: '/ranking', label: 'Ranking', icon: <Trophy className="h-4 w-4 mr-1" /> },
    { path: '/store', label: 'Store', icon: <ShoppingBag className="h-4 w-4 mr-1" /> },
    { path: '/admin', label: 'Admin', icon: <Settings className="h-4 w-4 mr-1" />, includes: ["/admin", "/manage-store", "/create-problems", "/manage-users", "/manage-problems", "/manage-purchase"] },
  ];

  const visibleNavItems = navItems.filter(item => {
    if (!isAdmin && item.path === "/admin") {
      return false;
    }
    return true;
  });


  const getLinkClass = (includes: string[]) =>
    includes.some((p) => location.pathname.startsWith(p))
      ? 'flex items-center px-4 py-2 rounded-full bg-red-600 text-white font-medium shadow'
      : 'flex items-center px-4 py-2 rounded-full text-gray-700 hover:bg-red-100 transition';

  return (
    <nav className="bg-white shadow-xl sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo + Hamburguesa */}
        <div className="flex items-center gap-2 h-full">
          <Link to="/" className="flex items-center h-full">
            <img
              src={logo}
              alt="CodeMahindra Logo"
              className="h-[55%] w-auto object-contain"
            />
          </Link>
          <button
            className="md:hidden p-2 rounded hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Navegación Desktop */}
        <div className="hidden md:flex items-center space-x-2">
          {visibleNavItems.map(({ path, label, icon, includes }) => (
            <Link key={path} to={path} className={getLinkClass(includes || [path])}>
              {icon}
              {label}
            </Link>
          ))}
        </div>

        {/* Íconos + Usuario */}
        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            className="relative p-2 hover:bg-gray-100 rounded-full"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {}
              </span>
            )}
          </button>
          <UserMenu />
        </div>
      </div>

      {showNotifications && (
        <div className="absolute right-4 top-16 w-80 bg-white rounded-2xl shadow-2xl border border-red-200 z-50 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-red-100 bg-red-50 rounded-t-2xl">
            <h3 className="text-sm font-semibold text-red-700">Notifications</h3>
            <span className="text-xs text-red-400 font-medium">{notifications.length} New</span>
          </div>

          {/* List */}
          <ul className="max-h-96 overflow-y-auto divide-y divide-gray-100">
            {notifications.map((notif, index) => (
              <li
                key={index}
                className="flex items-start gap-3 px-4 py-3 hover:bg-red-50 transition-all"
              >
                <div className="text-xl">{notif.icon}</div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{notif.message}</p>
                  <p className="text-xs text-red-400 mt-1">{notif.time}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-red-100 text-right bg-white rounded-b-2xl">
            <button
              onClick={() => setShowNotifications(false)}
              className="text-sm text-red-500 hover:underline font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Menú Mobile */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col space-y-2">
          {visibleNavItems.map(({ path, label, icon, includes }) => (
            <Link key={path} to={path} className={getLinkClass(includes || [path])}>
              {icon}
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
