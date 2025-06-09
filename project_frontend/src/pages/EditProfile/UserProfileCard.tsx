import { Upload, Coins } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  user: {
    profilePicture?: string;
    coins: number;
  };
  initials: string;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStoreClick?: () => void;
}

export default function UserProfileCard({
  user,
  initials,
  handleImageUpload,
  onStoreClick,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-xl p-6 h-fit border border-gray-200"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Profile Picture</h2>

      <div className="flex flex-col items-center">
        <div className="relative group w-40 h-40 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shadow-inner">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-500 text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] font-semibold">
              {initials}
            </span>
          )}
          <label
            htmlFor="profile-picture"
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
          >
            <Upload className="h-8 w-8 text-white" />
          </label>
          <input
            type="file"
            id="profile-picture"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>

        <p className="text-sm text-gray-500 text-center mt-3">
          Click the image to change your profile picture
        </p>
      </div>

      {/* Coins section */}
      <div className="mt-8">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center mb-3 text-gray-700">
            <Coins className="h-5 w-5 text-yellow-500 mr-2" />
            <h3 className="font-semibold text-base">Coins</h3>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-800">{user.coins}</span>
            <button
              type="button"
              onClick={onStoreClick}
              className="text-sm text-red-500 hover:text-red-600 font-medium transition"
            >
              View Store
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
