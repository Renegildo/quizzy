import axios from 'axios';
import cookies from 'js-cookie';

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

export const register = async (username: string, password: string) => {
  const registerResponse = await axios.post(
    apiUrl + "/register",
    { username, password },
  );

  return registerResponse.data;
}

export const login = async (username: string, password: string) => {
  const loginReponse = await axios.post(
    apiUrl + "/login",
    { username, password }
  );

  return {
    token: loginReponse.data.token,
    refreshToken: loginReponse.data.refreshToken,
  };
}

export const getSelf = async (token: string, refreshToken: string) => {
  try {
    const self = await axios.get(
      apiUrl + "/self",
      {
        headers: {
          Authorization: token,
          'refresh-token': refreshToken,
        },
      },
    );

    return self.data.user;
  } catch (error: any) {
    cookies.set("token", error.response.data.token);

    const newSelf = await axios.get(
      apiUrl + "/self",
      {
        headers: {
          Authorization: error.response.data.token,
          'refresh-token': refreshToken,
        },
      },
    );

    return newSelf.data.user;
  }
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
  refreshToken: string,
) => {
  try {
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
          'refresh-token': refreshToken,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    cookies.set("token", error.response.data.token);

    const newResponse = await axios.post(
      apiUrl + "/quiz",
      {
        title,
        description,
        questions
      },
      {
        headers: {
          Authorization: error.response.data.token,
          'refresh-token': refreshToken,
        },
      },
    );

    return newResponse.data;
  }
}

export const generateNewRefreshToken = async (oldRefreshToken: string) => {
  const newRefreshToken = await axios.post(
    apiUrl + "/refreshToken",
    {
      refreshToken: oldRefreshToken,
    },
  );

  return newRefreshToken.data.token;
}

export const deleteQuiz = async (id: string, token: string, refreshToken: string) => {
  const response = await axios.delete(
    apiUrl + `/quiz/${id}`,
    {
      headers: {
        Authorization: token,
        'refresh-token': refreshToken,
      },
    }
  );

  return response.data;
}

