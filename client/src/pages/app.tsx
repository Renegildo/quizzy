import { useEffect, useState } from "react";
import Header from "../components/header";
import { getQuizzes } from "../utils/api";
import QuizCard from "../components/QuizCard";
import { Quiz } from "../utils/types";

const App = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>();

  useEffect(() => {
    const fetchQuizzes = async () => {
      const newQuizzes = await getQuizzes();

      setQuizzes(newQuizzes);
    }

    fetchQuizzes();
  }, []);

  return (
    <div className="bg-background text-white">
      <Header />
      <h1 className="ml-3 text-4xl font-bold mt-8 mb-4">
        Lista de Quizzes
      </h1>
      <div className="flex gap-5 flex-col mt-3">
        {
          quizzes ? (
            quizzes.map((quiz: Quiz) => (
              <QuizCard quiz={quiz} key={quiz.id} />
            ))
          ) : (
            <p>loading</p>
          )
        }
      </div>
    </div>
  );
}

export default App;
