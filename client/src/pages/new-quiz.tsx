import React, { useState } from "react";
import { createQuiz } from "../utils/api";
import cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

export interface IQuestion {
  content: string;
  answers: string[];
  correct_answer: number;
}

const NewQuiz = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<"general" | "questions">("general");

  const [quizTitle, setQuizTitle] = useState<string>("");
  const [quizDescription, setQuizDescription] = useState<string>("");

  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [newQuestionModalIsOpen, setNewQuestionModalIsOpen] = useState<boolean>(false);
  const [newQuestionContent, setNewQuestionContent] = useState<string>("");
  const [currentQuestionAnswers, setCurrentQuestionAnswers] = useState<string[]>([]);
  const [currentQuestionCorrectAnswer, setCurrentQuestionCorrectAnswer] = useState<number>(0);

  const [answer, setAnswer] = useState<string>("");

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("questions");
  }

  const createQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    setQuestions([...questions, {
      content: newQuestionContent,
      answers: currentQuestionAnswers,
      correct_answer: currentQuestionCorrectAnswer,
    }]);
  }

  const deleteItemFromCurrentQuestionAnswer = (index: number) => {
    setCurrentQuestionAnswers(currentQuestionAnswers.filter((_, i) => i !== index));
  }

  const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  }

  const handleCreateQuiz = async () => {
    const token = cookies.get("token");
    if (!token) return navigate("/login");

    const response = await createQuiz(quizTitle, quizDescription, questions, token);
    console.log(response);
  }

  return (
    <div>
      <h1>{quizTitle}</h1>
      {
        formState === "general" && (
          <form className="flex flex-col gap-3" onSubmit={handleProceed}>
            <input
              placeholder="titulo do quiz"
              onChange={(e) => setQuizTitle(e.target.value)}
            />
            <input
              placeholder="descricao do quiz"
              onChange={(e) => setQuizDescription(e.target.value)}
            />
            <button type="submit">
              proceed
            </button>
          </form>
        )
      }
      {
        formState === "questions" && (
          <div className="my-10">
            <h2>Perguntas</h2>
            {
              questions.map((question, i) => (
                <div key={i}>
                  <div className="flex">
                    <h3 className="text-xl font-bold">
                      {question.content}
                    </h3>
                    <button onClick={() => deleteQuestion(i)}>
                      delete
                    </button>
                  </div>
                  <ul>
                    {question.answers.map((answer, i) => (
                      <li key={i}>
                        {answer}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            }
            <button type="button" onClick={() => setNewQuestionModalIsOpen(true)}>
              Adicionar Pergunta
            </button>
            <button onClick={handleCreateQuiz}>
              Criar quiz
            </button>
          </div>
        )
      }
      {
        newQuestionModalIsOpen && (
          <form className="flex flex-col bg-gray-200 p-5">
            Pergunta:
            <input
              placeholder="Ex.: Que dia o pele nasceu?"
              onChange={(e) => setNewQuestionContent(e.target.value)}
            />
            <h2 className="text-2xl">Respostas:</h2>
            <ul>
              {
                currentQuestionAnswers.map((answer, i) => (
                  <li key={i} className="flex gap-3 bg-gray-400 my-5">
                    <p className="text-white">{answer}</p>
                    <button
                      type="button"
                      onClick={() => deleteItemFromCurrentQuestionAnswer(i)}
                    >
                      delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentQuestionCorrectAnswer(i)}
                    >
                      {currentQuestionCorrectAnswer === i ?
                        "resposta correta" :
                        "resposta errada"}
                    </button>
                  </li>
                ))
              }
              <input
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Ex.: 12 de outubro de 1983"
              />
              <button
                type="button"
                onClick={() => setCurrentQuestionAnswers([...currentQuestionAnswers, answer])}
              >
                Adicionar Resposta
              </button>
            </ul>
            <button type="button" onClick={createQuestion}>
              Criar Pergunta
            </button>
            <button type="button" onClick={() => setNewQuestionModalIsOpen(false)}>
              close
            </button>
          </form>
        )
      }
    </div>
  );
}

export default NewQuiz;
