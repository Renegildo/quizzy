import axios from 'axios';

const apiUrl = "http://localhost:3000";

export const getQuizzes = async () => {
  const quizzes = await axios.get(
    apiUrl + "/quizzes"
  );

  return quizzes.data.quizzes;
}

export const getQuiz = async (id: string) => {
  const quiz = await axios.get(
    apiUrl + `/quiz/${id}`
  );

  return quiz.data.quiz;
}

export const getUser = async (id: string) => {
  const user = await axios.get(
    apiUrl + `/user/${id}`
  );

  return user.data.user;
}

export const login = async (username: string, password: string) => {
  const loginReponse = await axios.post(
    apiUrl + "/login",
    { username, password }
  );


  return loginReponse.data.token;
}

export const getSelf = async (token: string) => {
  const self = await axios.get(
    apiUrl + "/self",
    {
      headers: {
        Authorization: token,
      },
    },
  );

  return self.data.user;
}

export interface IQuestion {
  content: string;
  answers: string[];
  correct_answer: number;
}

export const createQuiz = async (
  title: string,
  description: string,
  questions: IQuestion[],
  token: string,
) => {
  const response = await axios.post(
    apiUrl + "/quiz",
    {
      title,
      description,
      questions,
    },
    {
      headers: {
        Authorization: token,
      },
    },
  );

  return response.data;
}

