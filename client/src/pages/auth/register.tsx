
import { useState } from "react";
import { login, register } from "../../utils/api";
import cookies from 'js-cookie';
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let hasErrors = false;
    let newErrors = {
      username: errors.username,
      password: errors.password,
    };

    if (!username || username.length < 3) {
      newErrors = {
        ...newErrors,
        username: "Nome de usuario muito curto",
      };
      hasErrors = true;
    } else {
      newErrors = {
        ...newErrors,
        username: "",
      }
    }

    if (username.length > 20) {
      newErrors = {
        ...newErrors,
        username: "Nome de usuario muito longo",
      };
      hasErrors = true;
    } else {
      newErrors = {
        ...newErrors,
        username: "",
      }
    }

    if (!password || password.length < 8) {
      newErrors = {
        ...newErrors,
        password: "Senha muito curta",
      };
      hasErrors = true;
    } else {
      newErrors = {
        ...newErrors,
        password: "",
      }
    }

    if (password.length > 500) {
      newErrors = {
        ...newErrors,
        password: "Senha muito longa",
      };
      hasErrors = true;
    } else {
      newErrors = {
        ...newErrors,
        password: "",
      }
    }

    setErrors(newErrors);
    if (hasErrors) return setIsLoading(false);

    try {
      const newUser = await register(username, password);
      if (!newUser.msg) return; //TODO: add error handler

      const { token, refreshToken } = await login(username, password);

      cookies.set("token", token);
      cookies.set("refreshToken", refreshToken);

      return navigate("/app");
    } catch (error: any) {
      if (error.response.data.msg === "Username already taken") {
        setErrors({
          ...errors,
          username: "Usuario com esse nome ja existe. Tente outro nome."
        });
        setIsLoading(false);
      }
    }
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
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              className={`p-2 bg-backgroundDarker rounded-lg ${errors.username && "input-error"}`}
            />
            <div className="text-sm text-red-400">
              {errors.username}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label>
              Senha:
            </label>
            <input
              type="password"
              placeholder="Senha"
              onChange={(e) => setPassword(e.target.value)}
              className={`p-2 bg-backgroundDarker rounded-lg ${errors.password && "input-error"}`}
            />
            <div className="text-sm text-red-400">
              {errors.password}
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="text-white bg-purpleAccent w-full py-2 rounded-lg disabled:bg-purpleAccent/50"
          disabled={isLoading}
        >
          Registrar
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
