import { Link } from "react-router-dom";
import { useAuthStore } from "../store/AuthUser";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="bg-black/80 border-b border-gray-700 fixed w-full top-0 z-40 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
            <div className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-white">VibeTalk</h1>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-3">

            {authUser && (
              <>
                <Link
                  to="/profile"
                  className="px-3 py-1 flex items-center gap-2 text-white bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  onClick={logout}
                  className="px-3 py-1 flex items-center gap-2 text-white bg-red-600 rounded-md hover:bg-red-500 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
