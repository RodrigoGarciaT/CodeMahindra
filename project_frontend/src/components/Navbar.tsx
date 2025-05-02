import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Code2, BookOpen, Trophy, ShoppingBag, Bell, ShoppingCart, PlusCircle, Settings } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const { itemCount } = useCart();
  const location = useLocation(); // Get the current location
  const navigate = useNavigate(); // Hook to navigate programmatically

  const getLinkClass = (path: string) => {
    return location.pathname === path
      ? 'flex items-center px-4 py-2 rounded-md bg-red-500 text-white'
      : 'flex items-center px-4 py-2 rounded-md hover:bg-gray-100'; // Default class for non-active links
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link to="/landing" className="flex items-center">
              <Code2 className="h-8 w-8 text-red-500" />
            </Link>
            <div className="flex space-x-2">
              <Link to="/" className={getLinkClass('/')}>
                <Home className="h-4 w-4 mr-2" />
                Inicio
              </Link>
              <Link to="/problems" className={getLinkClass('/problems')}>
                <BookOpen className="h-4 w-4 mr-2" />
                Problemas
              </Link>
              <Link to="/tasks" className={getLinkClass('/tasks')}>
                <Code2 className="h-4 w-4 mr-2" />
                Tareas
              </Link>
              <Link to="/code" className={getLinkClass('/code')}>
                <Code2 className="h-4 w-4 mr-2" />
                Código
              </Link>
              <Link to="/ranking" className={getLinkClass('/ranking')}>
                <Trophy className="h-4 w-4 mr-2" />
                Ranking
              </Link>
              <Link to="/store" className={getLinkClass('/store')}>
                <ShoppingBag className="h-4 w-4 mr-2" />
                Store
              </Link>
              <Link to="/admin" className={getLinkClass('/admin')}>
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="p-2 rounded-full hover:bg-gray-100 relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Bell className="h-5 w-5" />
            </button>
            <div
                onClick={() => navigate("/Profile")}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
              >
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <span>Digital Creatives</span>
              </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
