import { Link } from "react-router-dom";
import { Quiz } from "../utils/types";
import useSelf from "../hooks/useSelf";
import { deleteQuiz } from "../utils/api";
import cookies from 'js-cookie';

import { FaTrash } from 'react-icons/fa';

interface QuizCardProps {
  quiz: Quiz;
}

const QuizCard = ({ quiz }: QuizCardProps) => {
  const { self } = useSelf();

  const handleDelete = async () => {
    const token = cookies.get("token");
    const refreshToken = cookies.get("refreshToken");
    if (!token || !refreshToken) return;

    const response = await deleteQuiz(quiz.id, token, refreshToken);
    console.log(response);
  }

  return (
    <div className="flex gap-5 bg-secondary p-3 mx-3 rounded-lg shadow-lg shadow-black/40 items-start">
      <Link to={`/app/q/${quiz.id}`} className="w-full">
        <h1 className="font-semibold text-xl mb-2">
          {quiz.title}
        </h1>
        <p className="text-mutedText">
          {quiz.description}
        </p>
        <p className="text-mutedText mt-2">
          Criado por:
          <b className="text-white">
            {" " + quiz.creator.username}
          </b>
        </p>
      </Link>
      <button
        style={{
          display: self?.id === quiz.creator.id ? "block" : "none"
        }}
        onClick={handleDelete}
        className="text-red-400 bg-white/10 p-2 rounded-full"
      >
        <FaTrash className="w-4 h-4" />
      </button>
    </div>
  );
}

export default QuizCard;
