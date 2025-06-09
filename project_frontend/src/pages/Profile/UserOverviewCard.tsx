import { Coins, Edit, Mail, MapPin, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "../../components/progress";
import CountryName from "../Home/CountryName";
import { Card } from "@/components/card";
import profilePic from "../../images/robot_male_1.svg"

type Props = {
  user: {
    profilePicture?: string;
    firstName: string;
    lastName: string;
    nationality?: string;
    email?: string;
    phoneNumber?: string;
    experience?: number;
    coins?: number;
  } | null;
};


const UserOverviewCard: React.FC<Props> = ({ user }) => {
  const navigate = useNavigate();
  const experience = user?.experience ?? 0;
  const level = Math.floor(experience / 1000);
  const progress = (experience % 1000) / 10;

  return (
    <div className="w-full">
      <Card className="w-full bg-[#f4f4f5] p-6 rounded-2xl shadow-md border border-gray-300 text-gray-800">

        {/* Profile Header */}
        <div className="bg-white p-4 rounded-xl shadow-inner border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-red-500">
                <img
                  src={user?.profilePicture ?? profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-gray-900">
                  {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
                </h2>
                {user?.nationality ? (
                  <CountryName code={user.nationality} />
                ) : (
                  <span className="text-sm text-gray-500">Not specified</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Coins className="h-5 w-5 text-yellow-500 mr-1" />
              <span>{user?.coins ?? 0}</span>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-2">
          <h3 className="text-md font-semibold text-gray-900">Progress</h3>
          <div className="flex justify-between text-sm text-gray-600">
            <span>
              Level <span className="text-red-500 font-bold">{level}</span>
            </span>
            <span>{experience} XP</span>
          </div>
          <Progress
            value={progress}
            className="h-3 bg-gray-300"
            indicatorClassName="bg-gradient-to-r from-red-500 to-red-600"
          />
        </div>

        {/* Personal Info */}
        <div className="bg-white mt-6 p-4 rounded-xl shadow-inner border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-semibold text-gray-900">Personal Information</h3>
            <button
              className="text-gray-500 hover:text-red-500 transition"
              onClick={() => navigate("/profile/view")}
            >
              <Edit className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-600" />
              <span>{user?.email ?? "Loading..."}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gray-600" />
              <span>{user?.phoneNumber ?? "Not provided"}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gray-600" />
              {user?.nationality ? (
                <CountryName code={user.nationality} />
              ) : (
                <span>Not specified</span>
              )}
            </div>
          </div>
        </div>

      </Card>
    </div>
  );
};

export default UserOverviewCard;
