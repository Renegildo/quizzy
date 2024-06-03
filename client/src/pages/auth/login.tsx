import { useRef, useState } from "react";
import { login } from "../../utils/api";
import cookies from 'js-cookie';
import useSelf from "../../hooks/useSelf";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [usernameErrorMessage, setUsernameErrorMessage] = useState<string>("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>("");

  const usernameInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);
  const passwordError = useRef<HTMLDivElement>(null);
  const usernameError = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { self } = useSelf();

  if (self) navigate("/app");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    if (!usernameInput.current?.value || usernameInput.current.value.length < 3) {
      setUsernameErrorMessage("Nome de usuario muito curto");
      usernameError.current?.classList.remove("hidden");
      setIsLoading(false);
      return usernameInput.current?.classList.add("input-error");
    } else {
      usernameError.current?.classList.add("hidden");
      usernameInput.current.classList.remove("input-error");
    }

    if (!passwordInput.current?.value || passwordInput.current.value.length < 8) {
      setPasswordErrorMessage("Senha muito curta");
      passwordError.current?.classList.remove("hidden");
      setIsLoading(false);
      return passwordInput.current?.classList.add("input-error");
    } else {
      usernameError.current?.classList.add("hidden");
      usernameInput.current.classList.remove("input-error");
    }

    try {
      const { token, refreshToken } = await login(username, password);

      cookies.set("token", token);
      cookies.set("refreshToken", refreshToken);

      return navigate("/app");
    } catch (error: any) {
      if (error.response.data.msg === "Password is incorrect") {
        setPasswordErrorMessage("Senha incorreta");
        passwordInput.current.classList.add("input-error");
        passwordError.current?.classList.remove("hidden");
      } else if (error.response.data.msg === "User not found") {
        setUsernameErrorMessage("Usuario nao encontrado");
        usernameInput.current.classList.add("input-error");
        usernameError.current?.classList.remove("hidden");
      }
      setIsLoading(false);
    }
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <form onSubmit={handleLogin} className="bg-secondary p-5 text-white rounded-lg shadow-black/50 shadow-lg">
        <h1 className="text-center text-3xl font-bold">
          Bem vindo de volta!
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
              className="p-2 bg-backgroundDarker rounded-lg"
              ref={usernameInput}
            />
            <div
              className="text-red-400 text-sm hidden"
              ref={usernameError}
            >
              {usernameErrorMessage}
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
              className="p-2 bg-backgroundDarker rounded-lg"
              ref={passwordInput}
            />
            <div
              className="text-red-400 text-sm hidden"
              ref={passwordError}
            >
              {passwordErrorMessage}
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="text-white bg-purpleAccent w-full py-2 rounded-lg disabled:bg-purpleAccent/50"
          disabled={isLoading}
        >
          Login
        </button>
        <Link
          to="/register"
          className="underline text-sm text-center"
        >
          Ainda nao tem uma conta?
        </Link>
      </form>
    </div>
  );
}

export default Login;
