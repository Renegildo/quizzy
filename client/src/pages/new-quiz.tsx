import React, { useState } from "react";
import { createQuiz } from "../utils/api";
import cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

import { FaBan, FaTrash } from 'react-icons/fa';
import Header from "../components/header";

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

    setNewQuestionModalIsOpen(false);
    setCurrentQuestionCorrectAnswer(0);
    setCurrentQuestionAnswers([]);
  }

  const deleteItemFromCurrentQuestionAnswer = (index: number) => {
    setCurrentQuestionAnswers(currentQuestionAnswers.filter((_, i) => i !== index));
  }

  const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  }

  const handleCreateQuiz = async () => {
    const token = cookies.get("token");
    const refreshToken = cookies.get("refreshToken");
    if (!token || !refreshToken) return navigate("/login");

    await createQuiz(quizTitle, quizDescription, questions, token, refreshToken);
    navigate("/app");
  }

  return (
    <>
      <Header />
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        {
          formState === "general" && (
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-3xl text-white font-bold text-center">
                Novo quiz
              </h1>
              <form
                className="flex flex-col bg-backgroundDarker p-5 rounded-md"
                onSubmit={handleProceed}
              >
                <label className="text-white font-semibold">
                  Titulo
                </label>
                <input
                  placeholder="Titulo do quiz"
                  onChange={(e) => setQuizTitle(e.target.value)}
                  className="mb-3 p-2 bg-secondary text-white rounded-md"
                />
                <label className="text-white font-semibold">
                  Descricao
                </label>
                <input
                  placeholder="Descricao do quiz"
                  onChange={(e) => setQuizDescription(e.target.value)}
                  className="p-2 bg-secondary text-white rounded-md"
                />
                <button
                  type="submit"
                  className="bg-purpleAccent text-white p-2 rounded-md mt-3 disabled:bg-purpleAccent/50"
                  disabled={quizTitle === "" || quizDescription === ""}
                >
                  Prosseguir
                </button>
              </form>
            </div>
          )
        }
        {
          formState === "questions" && (
            <div className="bg-secondary w-[640px] max-w-screen-sm p-5 rounded-lg shadow-black/40 shadow-lg">
              <h2 className="text-white text-center font-semibold text-3xl">
                Perguntas
              </h2>
              <div className="bg-backgroundDarker/60 p-3 rounded-lg flex flex-col gap-2 my-3">
                {
                  questions.length > 0 ? questions.map((question, i) => (
                    <div key={i} className="text-white bg-backgroundDarker/60 p-2 rounded-lg">
                      <div className="flex text-white justify-between">
                        <h3 className="text-xl font-bold">
                          {question.content}
                        </h3>
                        <button
                          onClick={() => deleteQuestion(i)}
                          className="text-red-400"
                        >
                          <FaTrash />
                        </button>
                      </div>
                      <div>
                        {question.answers.map((answer, i) => (
                          <div className="bg-backgroundDarker p-1 flex gap-3">
                            <div className={`w-6 h-6 rounded-full ${question.correct_answer === i ?
                              "bg-purpleAccent" :
                              "border border-purpleAccent"
                              }`} />
                            <div
                              key={i}
                            >
                              {answer}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )) : (
                    <div className="flex items-center flex-col bg-backgroundDarker/60 py-5 my-3 rounded-lg">
                      <FaBan className="text-mutedText w-8 h-8" />
                      <p className="text-mutedText text-center text-sm mt-2 leading-4">
                        Nenhuma <br /> pergunta
                      </p>
                    </div>
                  )
                }
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setNewQuestionModalIsOpen(true)}
                  className="text-white bg-purpleAccent py-2 rounded-md"
                >
                  Adicionar Pergunta
                </button>

                <button
                  className="text-white bg-purpleAccent py-2 rounded-md disabled:bg-purpleAccent/50"
                  onClick={handleCreateQuiz}
                  disabled={questions.length === 0}
                >
                  Criar quiz
                </button>
              </div>
            </div>
          )
        }
        {
          newQuestionModalIsOpen && (
            <>
              <div
                className="bg-black/70 w-screen h-screen fixed left-0 top-0"
                onClick={() => setNewQuestionModalIsOpen(false)}
              />

              <form
                className="flex flex-col max-w-screen-sm bg-secondary p-5 absolute rounded-lg text-white w-5/6 shadow-lg shadow-black/80 left-auto top-auto bottom-auto right-auto"
              >
                <h1 className="text-2xl font-semibold text-center mb-2.5">
                  Nova Pergunta
                </h1>
                <div className="flex flex-col gap-1 mb-4">
                  <label className="font-semibold">
                    Pergunta:
                  </label>
                  <input
                    placeholder="Ex: Qual o formato da Terra?"
                    onChange={(e) => setNewQuestionContent(e.target.value)}
                    className="p-2 bg-backgroundDarker text-white rounded-md"
                  />
                </div>
                <h2 className="font-semibold mb-1">
                  Respostas:
                </h2>
                {
                  currentQuestionAnswers.length > 0 ?
                    <div className="p-3 bg-backgroundDarker/60 rounded-lg">
                      {currentQuestionAnswers.map((answer, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 bg-backgroundDarker py-1 my-2 rounded-full justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-8 w-8 rounded-full cursor-pointer transition-colors
                            ${currentQuestionCorrectAnswer === i ? "bg-purpleAccent" : "border-2 border-purpleAccent"}
                          `}
                              onClick={() => setCurrentQuestionCorrectAnswer(i)}
                            />
                            <p className="text-white">
                              {answer}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteItemFromCurrentQuestionAnswer(i)}
                            className="text-red-400 mr-3"
                          >
                            <FaTrash />
                          </button>
                        </li>
                      ))}
                    </div> :
                    <div className="flex items-center flex-col bg-backgroundDarker/60 py-5 my-3 rounded-lg">
                      <FaBan className="text-mutedText w-8 h-8" />
                      <p className="text-mutedText text-center text-sm mt-2 leading-4">
                        Nenhuma <br /> resposta
                      </p>
                    </div>
                }
                <label className="font-medium">
                  Resposta:
                </label>
                <div className="flex items-center gap-3">
                  <input
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Ex: Redonda"
                    className="p-2 w-full bg-backgroundDarker text-white rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => currentQuestionAnswers.length < 7 && setCurrentQuestionAnswers([...currentQuestionAnswers, answer])}
                    className="p-2 w-[50%] border-purpleAccent border-2 rounded-md"
                  >
                    Adicionar Resposta
                  </button>
                </div>

                <button
                  type="button"
                  onClick={createQuestion}
                  className="bg-purpleAccent py-2 w-full rounded-md mt-5 disabled:bg-purpleAccent/50"
                  disabled={currentQuestionAnswers.length === 0 || newQuestionContent === ""}
                >
                  Criar Pergunta
                </button>
                <button
                  type="button"
                  onClick={() => setNewQuestionModalIsOpen(false)}
                  className="mt-1 underline"
                >
                  Fechar
                </button>
              </form>
            </>
          )
        }
      </div>
    </>
  );
}

export default NewQuiz;
