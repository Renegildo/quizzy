
import { useState } from "react";
import { login, register } from "../../utils/api";
import cookies from 'js-cookie';
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const newUser = await register(username, password);
    if (!newUser.msg) return; //TODO: add error handler

    const { token, refreshToken } = await login(username, password);

    cookies.set("token", token);
    cookies.set("refreshToken", refreshToken);

    return navigate("/app");
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <form onSubmit={handleRegister} className="bg-secondary p-5 text-white rounded-lg shadow-black/50 shadow-lg">
        <h1 className="text-center text-3xl font-bold">
          Crie sua conta!
        </h1>
        <div className="flex flex-col gap-3 my-5">
          <div className="flex flex-col gap-1">
            <label>
              Nome de Usuario:
            </label>
            <input
              type="text"
              placeholder="username"
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 bg-backgroundDarker rounded-lg"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label>
              Senha:
            </label>
            <input
              type="password"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 bg-backgroundDarker rounded-lg"
            />
          </div>
        </div>
        <button
          type="submit"
          className="text-white bg-purpleAccent w-full py-2 rounded-lg"
        >
          Criar conta
        </button>
        <Link
          to="/login"
          className="underline text-sm text-center"
        >
          Ja tem uma conta?
        </Link>
      </form>
    </div>
  );
}

export default Register;
