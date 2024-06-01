import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Quiz } from "../utils/types";
import { getQuiz } from "../utils/api";
import QuestionBall from "../components/question-ball";
import Skeleton from "../components/skeleton";
import Header from "../components/header";

const QuizPage = () => {
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [quiz, setQuiz] = useState<Quiz>();
  const [answers, setAnswers] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!id) return;
      const newQuiz = await getQuiz(id);
      setQuiz(newQuiz);
    }

    fetchQuiz();
  }, []);

  const handleAnswer = (answer: number) => {
    if (!quiz?.questions) return;

    let newCorrectAnswers;

    if (answer === quiz.questions[currentQuestion].correct_answer) {
      newCorrectAnswers = correctAnswers + 1;
      setCorrectAnswers(newCorrectAnswers);
    } else {
      newCorrectAnswers = correctAnswers;
    }

    setAnswers([...answers, answer]);

    if (!quiz.questions[currentQuestion + 1]) {
      setIsModalOpen(true);
      return;
    }

    setCurrentQuestion(state => state + 1);
  }

  if (!quiz) return <QuizPageSkeleton />

  return (
    <>
      <Header />
      <div
        className="h-[calc(100vh-64px)] w-screen flex items-center justify-center flex-col text-white max-w-screen-sm ml-auto mr-auto"
      >
        <h1 className="text-3xl font-bold">
          {quiz?.title}
        </h1>
        <div className="flex gap-5 my-3 p-2">
          {
            quiz?.questions.map((question, i) => (
              question.correct_answer === answers[i]
                ? <QuestionBall type="correct" key={i} />
                : answers[i] === undefined
                  ? <QuestionBall type="undefined" key={i} />
                  : <QuestionBall type="wrong" key={i} />
            ))
          }
        </div>
        <div className="bg-secondary p-3 w-5/6 rounded-lg shadow shadow-black/30">
          <h2 className="text-2xl font-semibold text-center">
            {quiz?.questions[currentQuestion].content}
          </h2>
        </div>
        <div className="flex flex-col gap-5 mt-5 w-5/6">
          {
            quiz?.questions[currentQuestion].answers.map((answer, index) => (
              <button
                key={answer}
                onClick={() => handleAnswer(index)}
                className="bg-secondary p-3 w-full rounded-lg text-start flex items-center gap-2 shadow-lg shadow-black/30"
              >
                <div className="w-7 h-7 bg-purpleAccent rounded-full" />
                {answer}
              </button>
            ))
          }
        </div>

        <div
          className={`bg-black/60 absolute w-full h-full top-0 left-0 
        ${isModalOpen ? "block" : "hidden"}`}
          onClick={() => setIsModalOpen(false)}
        />
        <div
          className={`absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-secondary text-white p-5 w-max rounded-lg shadow-lg shadow-black/60
          ${isModalOpen ? "block" : "hidden"}`}
        >
          <h2 className="text-center font-semibold text-2xl mb-2">
            Resultado Final
          </h2>
          <h1 className="text-5xl text-center font-bold">
            {correctAnswers}/{quiz?.questions.length}
          </h1>
          <p className="text-center text-mutedText text-sm leading-4 mb-4">
            Voce acertou {correctAnswers} <br />
            questoes de {quiz?.questions.length}
          </p>
          <div className="flex w-full">
            <Link to={"/app"} className="bg-purpleAccent py-2 px-5 rounded-md w-full text-center">
              Tela Inicial
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export const QuizPageSkeleton = () => {
  return (
    <div className="max-w-screen-sm h-screen flex items-center justify-center flex-col gap-5 ml-auto mr-auto">
      <Skeleton className="h-10 w-64 rounded-lg" />
      <div className="flex gap-5">
        {[...Array(5)].map((_, i) => (
          <Skeleton className="h-7 w-7 rounded-full" key={i} />
        ))}
      </div>
      <div className="bg-secondary flex items-center justify-center h-20 w-5/6 p-5 rounded-lg">
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
      <div className="flex flex-col gap-5 w-5/6">
        {[...Array(3)].map((_, i) => (
          <div className="bg-secondary p-5 rounded-lg" key={i}>
            <Skeleton className="h-7 w-64 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuizPage;
