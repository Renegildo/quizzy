import { Link } from "react-router-dom";
import { Quiz } from "../utils/types";
import useSelf from "../hooks/useSelf";
import { deleteQuiz } from "../utils/api";
import cookies from 'js-cookie';

import { FaTrash } from 'react-icons/fa';
import Skeleton from "./skeleton";

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
        <p className="text-mutedText mt-2 flex gap-1">
          Criado por:
          <Link to={`/app/u/${quiz.creator.id}`}>
            <b className="text-white underline">
              {quiz.creator.username}
            </b>
          </Link>
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

export const QuizCardSkeleton = () => {
  return (
    <div className="flex gap-5 bg-secondary p-3 mx-3 rounded-lg shadow-lg shadow-black/40 items-start">
      <div className="w-full">
        <Skeleton className="h-10 w-40 rounded-lg" />
        <Skeleton className="h-32 w-full my-3 rounded-lg" />
        <Skeleton className="h-5 w-32 rounded-lg" />
      </div>
    </div>
  );
}

export default QuizCard;
