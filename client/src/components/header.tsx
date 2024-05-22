import { Link } from "react-router-dom";
import useSelf from "../hooks/useSelf";

const Header = () => {
  const { self } = useSelf();

  return (
    <div className="flex justify-between">
      <h1 className="text-3xl">
        Quizzy
      </h1>
      <ul>
        <li>
          <Link to={"/app"}>
            Home
          </Link>
        </li>
        <li>
          <Link to={"/app/newQuiz"}>
            New Quiz
          </Link>
        </li>
        {self && self.username && (
          <li>
            {self.username}
          </li>
        )}
      </ul>
    </div>
  );
}

export default Header;
