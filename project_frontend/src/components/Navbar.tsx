import { Link, useLocation } from 'react-router-dom';
import {
  Home, Code2, BookOpen, Trophy, ShoppingBag, Bell, ShoppingCart, ListTodo, Settings, Menu
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import UserMenu from './UserMenu';
import logo from '../images/logo-codemahindra.png';
import { useState } from 'react';

const Navbar = () => {
  const { itemCount } = useCart();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Inicio', icon: <Home className="h-4 w-4 mr-1" /> },
    { path: '/problems', label: 'Problemas', icon: <BookOpen className="h-4 w-4 mr-1" /> },
    { path: '/tasks', label: 'Tareas', icon: <ListTodo className="h-4 w-4 mr-1" /> },
    { path: '/code', label: 'Código', icon: <Code2 className="h-4 w-4 mr-1" /> },
    { path: '/ranking', label: 'Ranking', icon: <Trophy className="h-4 w-4 mr-1" /> },
    { path: '/store', label: 'Tienda', icon: <ShoppingBag className="h-4 w-4 mr-1" /> },
    { path: '/admin', label: 'Admin', icon: <Settings className="h-4 w-4 mr-1" /> },
  ];

  const getLinkClass = (path: string) =>
    location.pathname === path
      ? 'flex items-center px-4 py-2 rounded-full bg-red-600 text-white font-medium shadow'
      : 'flex items-center px-4 py-2 rounded-full text-gray-700 hover:bg-red-100 transition';

  return (
    <nav className="bg-white shadow-xl sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo + Hamburguesa */}
        <div className="flex items-center gap-2 h-full">
          <Link to="/landing" className="flex items-center h-full">
            <img
              src={logo}
              alt="CodeMahindra Logo"
              className="h-full w-auto object-contain"
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
          {navItems.map(({ path, label, icon }) => (
            <Link key={path} to={path} className={getLinkClass(path)}>
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
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Bell className="h-5 w-5" />
          </button>
          <UserMenu />
        </div>
      </div>

      {/* Menú Mobile */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col space-y-2">
          {navItems.map(({ path, label, icon }) => (
            <Link key={path} to={path} className={getLinkClass(path)} onClick={() => setMenuOpen(false)}>
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
