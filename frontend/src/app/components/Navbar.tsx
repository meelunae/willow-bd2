import Link from "next/link";
import SearchBar from "./SearchBar";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { User } from "lucide-react";
import LoginModal from "./LoginModal";
import { getCurrentUser } from "../api/auth";
import Image from "next/image";
import { Track } from "../types";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface NavbarProps {
  setTracks?: Dispatch<SetStateAction<Track[]>>;
  resetIndex?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ setTracks, resetIndex }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const user = await getCurrentUser();
        setUser(user);
      } catch (err) {
        // Token is invalid or missing, user will remain null
        console.log('No valid session found:', err instanceof Error ? err.message : 'Unknown error');
        localStorage.removeItem('token'); // Clean up invalid token
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const handleLoginSuccess = (token: string, user: User) => {
    localStorage.setItem('token', token);
    setUser(user);
  };

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <nav className="bg-[#0a0a26] p-4 flex justify-between items-center shadow-md shadow-blue-500/30">
      <div className="flex items-center gap-2">
        <Link href="/">
          <Image
            src="/willow_logo.png"
            alt="Logo"
            width={100}
            height={50}
            className="max-w-[100px] w-full h-auto filter dark:invert"
          />
        </Link>
        <div className="flex gap-4">
          <Link href="/" className="text-white">
            Top Tracks
          </Link>
          <Link href="/discography-analytics" className="text-white">
            Discography Analytics
          </Link>
          {user?.role === 'admin' && (
            <Link href="/admin/data-management" className="text-white">
              Data Management
            </Link>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        {setTracks && resetIndex && (
          <SearchBar setTracks={setTracks} resetIndex={resetIndex} />
        )}
        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-gray-300">{user.username}</span>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                setUser(null);
              }}
              className="text-sm text-gray-400 hover:text-white"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
          >
            <User className="w-5 h-5 text-gray-300" />
          </button>
        )}
      </div>
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />
    </nav>
  );
};

export default Navbar;
