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
    <>
      <Header />
      {
        quizzes ? (
          quizzes.map((quiz: Quiz) => (
            <QuizCard quiz={quiz} key={quiz.id} />
          ))
        ) : (
          <p>loading</p>
        )
      }
    </>
  );
}

export default App;
