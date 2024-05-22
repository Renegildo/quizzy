import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Quiz } from "../utils/types";
import { getQuiz } from "../utils/api";
import QuestionBall from "../components/question-ball";

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

  return (
    <div>
      <h1>
        {quiz?.title}
      </h1>
      <p>
        {quiz?.description}
      </p>
      <div className="flex gap-5">
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
      <h2>
        {quiz?.questions[currentQuestion].content}
      </h2>
      <div className="flex flex-col gap-4">
        {
          quiz?.questions[currentQuestion].answers.map((answer, index) => (
            <button
              key={answer}
              onClick={() => handleAnswer(index)}
            >
              {answer}
            </button>
          ))
        }
      </div>

      <div
        className={`absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-slate-900 text-white p-5 z-20 w-max
                  ${isModalOpen ? "block" : "hidden"}
      `}
      >
        <h1 className="text-center font-bold text-xl mb-2">
          Resultado Final
        </h1>
        <h2 className="text-5xl text-center">
          {correctAnswers}/{quiz?.questions.length}
        </h2>
        <p className="text-center text-zinc-400">
          Voce acertou {correctAnswers} <br />
          questoes de {quiz?.questions.length}
        </p>
        <div className="flex w-full">
          <Link to={"/app"} className="bg-red-800 py-2 px-5 rounded-md w-full text-center">
            Tela Inicial
          </Link>
        </div>
      </div>


      <div className={`bg-black/50 absolute w-full h-full top-0 left-0 z-10
                      ${isModalOpen ? "block" : "hidden"}`} />
    </div>
  );
}

export default QuizPage;
