import React, { useState } from 'react';
import { Shield, ShieldOff, Trash2, Search } from 'lucide-react';

interface UserManage {
  profileEpic: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  id: string;
}

const initialUsers: UserManage[] = [
  {
    profileEpic: "https://images.pexels.com/photos/2269872/pexels-photo-2269872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    isAdmin: true,
    id: "f683124d-6fc7-4586-8590-86573f5aa66e"
  },
  {
    profileEpic: "https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    isAdmin: false,
    id: "f683124d-6fc7-4586-8590-86573f5aa67e"
  },
  {
    profileEpic: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike@example.com",
    isAdmin: false,
    id: "f683124d-6fc7-4586-8590-86573f5aa68e"
  }
];

interface UserCardProps {
  user: UserManage;
  onDelete: (id: string) => void;
  onToggleAdmin: (id: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onDelete, onToggleAdmin }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg text-gray-800">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={user.profileEpic}
          alt={`${user.firstName} ${user.lastName}`}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h2 className="text-xl font-semibold">{`${user.firstName} ${user.lastName}`}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm ${
            user.isAdmin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {user.isAdmin ? 'Admin' : 'User'}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onToggleAdmin(user.id)}
            className={`p-2 rounded-lg transition-colors ${
              user.isAdmin 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
            title={user.isAdmin ? 'Remove admin status' : 'Make admin'}
          >
            {user.isAdmin ? <ShieldOff size={20} /> : <Shield size={20} />}
          </button>
          <button
            onClick={() => onDelete(user.id)}
            className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-white"
            title="Delete user"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<UserManage[]>(initialUsers);
  const [filter, setFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const handleToggleAdmin = (id: string) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, isAdmin: !user.isAdmin } : user
    ));
  };

  const filteredUsers = users
    .filter(user => {
      if (filter === 'admin') return user.isAdmin;
      if (filter === 'user') return !user.isAdmin;
      return true;
    })
    .filter(user => 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-[#1e1e1e] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white">Manage Users</h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="bg-[#2d2d2d] text-gray-200 rounded-lg pl-10 pr-4 py-2 w-full placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="bg-[#2d2d2d] text-gray-200 rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'admin' | 'user')}
            >
              <option value="all">All Users</option>
              <option value="admin">Admins Only</option>
              <option value="user">Regular Users</option>
            </select>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-lg p-6 text-center text-gray-800">
            <p className="text-xl">No users found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map(user => (
              <UserCard 
                key={user.id} 
                user={user} 
                onDelete={handleDeleteUser} 
                onToggleAdmin={handleToggleAdmin} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
