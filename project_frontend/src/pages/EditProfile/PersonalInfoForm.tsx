import { Check, X, User, Mail, Phone, Flag, Briefcase, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CountryName from "../Home/CountryName";

interface Props {
  user: {
    firstName: string;
    lastName: string;
    sub?: string;
    phoneNumber?: string;
    nationality?: string;
    experience: number;
    profilePicture?: string;
    coins?: number;
    isAdmin?: boolean;
    email?: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  saving: boolean;
  success: boolean | null;
}

const PersonalInfoForm = ({ user, handleChange, saving, success }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">Personal Information</h2>
        {success === true && (
          <div className="flex items-center text-green-500 bg-green-50 px-3 py-1 rounded-full">
            <Check className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">Saved</span>
          </div>
        )}
        {success === false && (
          <div className="flex items-center text-red-500 bg-red-50 px-3 py-1 rounded-full">
            <X className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">Error saving</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={user.firstName}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Your name"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Your last name"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={user.sub || ""}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
              placeholder="you@email.com"
              disabled
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={user.phoneNumber ?? ""}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="+1 234 567 890"
            />
          </div>
        </div>

        <div>
          <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-1">
            Nationality
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Flag className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="nationality"
              name="nationality"
              value={user.nationality ?? ""}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
            >
                <option value="">Select a country</option>
                <option value="AF">Afganistán</option>
                <option value="DE">Alemania</option>
                <option value="AR">Argentina</option>
                <option value="AU">Australia</option>
                <option value="BR">Brasil</option>
                <option value="CA">Canadá</option>
                <option value="CL">Chile</option>
                <option value="CN">China</option>
                <option value="CO">Colombia</option>
                <option value="KR">Corea del Sur</option>
                <option value="CU">Cuba</option>
                <option value="DK">Dinamarca</option>
                <option value="EC">Ecuador</option>
                <option value="EG">Egipto</option>
                <option value="SV">El Salvador</option>
                <option value="ES">España</option>
                <option value="US">Estados Unidos</option>
                <option value="FR">Francia</option>
                <option value="GR">Grecia</option>
                <option value="GT">Guatemala</option>
                <option value="HN">Honduras</option>
                <option value="IN">India</option>
                <option value="ID">Indonesia</option>
                <option value="IE">Irlanda</option>
                <option value="IT">Italia</option>
                <option value="JP">Japón</option>
                <option value="MX">México</option>
                <option value="NI">Nicaragua</option>
                <option value="NO">Noruega</option>
                <option value="PA">Panamá</option>
                <option value="PY">Paraguay</option>
                <option value="PE">Perú</option>
                <option value="PL">Polonia</option>
                <option value="PT">Portugal</option>
                <option value="GB">Reino Unido</option>
                <option value="DO">República Dominicana</option>
                <option value="RU">Rusia</option>
                <option value="SE">Suecia</option>
                <option value="CH">Suiza</option>
                <option value="TH">Tailandia</option>
                <option value="TR">Turquía</option>
                <option value="UY">Uruguay</option>
                <option value="VE">Venezuela</option>
                <option value="VN">Vietnam</option>
            </select>
            {user.nationality && (
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <CountryName code={user.nationality} showCountryName={false} />
              </div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
            Experience (XP)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Briefcase className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              id="experience"
              name="experience"
              value={user.experience}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
              placeholder="0"
              disabled
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Experience is earned by completing challenges</p>
        </div>
      </div>

      <div className="mt-8 flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-colors flex items-center justify-center min-w-[120px]"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
