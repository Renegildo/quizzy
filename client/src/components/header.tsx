import { Link } from "react-router-dom";
import useSelf from "../hooks/useSelf";
import { FaHome, FaPlus, FaUser } from 'react-icons/fa';
import Skeleton from "./skeleton";

const Header = () => {
  const { self } = useSelf();

  return (
    <header className="flex justify-between items-center bg-backgroundDarker p-3 text-white">
      <h1 className="text-2xl text-mutedText">
        Ola,
        <b className="text-white">
          {" " + self?.username}!
        </b>
      </h1>

      <nav className="flex gap-3">
        <Link to={"/app"} className="bg-white/10 rounded-full p-3">
          <FaHome className="w-4 h-4" />
        </Link>
        {self && self.username && (
          <Link to={`/app/u/${self.id}`} className="bg-white/10 rounded-full p-3">
            <FaUser />
          </Link>
        )}
        <Link to={"/app/newQuiz"} className="bg-purpleAccent rounded-full p-3">
          <FaPlus className="w-4 h-4" />
        </Link>
      </nav>
    </header>
  );
}

export const HeaderSkeleton = () => {
  return (
    <header className="w-full h-16 p-3 bg-backgroundDarker flex justify-between items-center">
      <Skeleton className="h-8 w-64 rounded-lg" />
      <div className="flex gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </header>
  );
}

export default Header;
