import { useEffect, useState } from "react";
import { getUser } from "../utils/api";
import { useParams } from "react-router-dom";

import { User } from "../utils/types";
import Header, { HeaderSkeleton } from "../components/header";
import QuizCard, { QuizCardSkeleton } from "../components/quiz-card";
import Skeleton from "../components/skeleton";

const UserPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState<null | User>(null);


  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;

      const newUser = await getUser(id);
      console.log(newUser);
      setUser(newUser);
    }
    fetchUser();
  }, []);

  if (!user) return <UserPageSkeleton />

  return (
    <div>
      <Header />
      <div className="max-w-screen-sm ml-auto mr-auto">
        <h1 className="text-4xl text-white font-bold mt-5 ml-3">
          Quizzes criados por {user?.username}
        </h1>
        <div className="text-white flex flex-col gap-5 mt-4 ">
          {user?.quizzes.map(quiz => (
            <QuizCard quiz={quiz} />
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
