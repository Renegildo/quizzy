import { useState } from "react";
import { login } from "../../utils/api";
import cookies from 'js-cookie';
import useSelf from "../../hooks/useSelf";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");


  const { self } = useSelf();

  if (self) navigate("/app");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = await login(username, password);
    if (!token) return;
    cookies.set("token", token);
    return navigate("/app");
  }

  return (
    <form onSubmit={handleLogin} className="flex flex-col">
      <input
        type="text"
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">
        Login
      </button>
    </form>
  );
}

export default Login;
