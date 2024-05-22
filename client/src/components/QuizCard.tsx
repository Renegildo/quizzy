import { Link } from "react-router-dom";
import { Quiz } from "../utils/types";

interface QuizCardProps {
  quiz: Quiz;
}

const QuizCard = ({ quiz }: QuizCardProps) => {
  return (
    <Link to={`/app/q/${quiz.id}`}>
      <p>{quiz.title}</p>
      <p>{quiz.description}</p>
    </Link>
  );
}

export default QuizCard;
