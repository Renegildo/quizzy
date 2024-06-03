import { useEffect, useState } from "react";
import { getUser } from "../utils/api";
import { useParams } from "react-router-dom";

import { Quiz, User } from "../utils/types";
import Header, { HeaderSkeleton } from "../components/header";
import QuizCard, { QuizCardSkeleton } from "../components/quiz-card";
import Skeleton from "../components/skeleton";

const UserPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState<null | User>(null);

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;

      const newUser = await getUser(id);
      setUser(newUser);
      setQuizzes(newUser.quizzes);
    }
    fetchUser();
  }, []);

  if (!user) return <UserPageSkeleton />

  const handleDeleteQuiz = (id: string) => {
    setQuizzes(quizzes.filter(quiz => quiz.id !== id));
  }

  return (
    <div>
      <Header />
      <div className="max-w-screen-sm ml-auto mr-auto">
        <h1 className="text-4xl text-white font-bold mt-5 ml-3">
          Quizzes criados por {user?.username}
        </h1>
        <div className="text-white flex flex-col gap-5 mt-4 ">
          {quizzes.map(quiz => (
            <QuizCard handleQuizDelete={() => handleDeleteQuiz(quiz.id)} quiz={quiz} key={quiz.id} />
          ))}
        </div>
      </div>
    </div>
  );
}

export const UserPageSkeleton = () => {

  return (
    <div>
      <HeaderSkeleton />
      <div className="max-w-screen-sm ml-auto mr-auto">
        <Skeleton className="h-10 w-64 ml-3 mt-4 rounded-lg" />
        <div className="flex flex-col gap-5 mt-4">
          {[...Array(3)].map((_, i) => (
            <QuizCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserPage;
