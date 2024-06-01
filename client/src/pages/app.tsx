import { useEffect, useState } from "react";
import Header, { HeaderSkeleton } from "../components/header";
import { getQuizzes } from "../utils/api";
import QuizCard, { QuizCardSkeleton } from "../components/quiz-card";
import { Quiz } from "../utils/types";
import Skeleton from "../components/skeleton";

const App = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>();

  useEffect(() => {
    const fetchQuizzes = async () => {
      const newQuizzes = await getQuizzes();

      setQuizzes(newQuizzes);
    }

    fetchQuizzes();
  }, []);

  if (!quizzes) return <AppSkeleton />

  return (
    <div className="bg-background">
      <Header />

      <div className="max-w-screen-sm ml-auto mr-auto">
        <h1 className="ml-3 text-4xl font-bold mt-8 mb-4 text-white">
          Lista de Quizzes
        </h1>
        <div className="flex gap-5 flex-col mt-3 text-white">
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
    </div>
  );
}

export const AppSkeleton = () => {
  return (
    <div className="bg-background">
      <HeaderSkeleton />
      <div className="max-w-screen-sm ml-auto mr-auto mt-8">
        <Skeleton className="h-10 w-72 rounded-lg ml-4" />
        <div className="flex flex-col gap-5 mt-3">
          {[...Array(5)].map((_, i) => (
            <QuizCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
