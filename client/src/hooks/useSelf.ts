import { useEffect, useState } from "react"
import cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { getSelf } from "../utils/api";
import { User } from "../utils/types";

const useSelf = () => {
  const navigate = useNavigate();
  const [self, setSelf] = useState<User | null>();

  useEffect(() => {
    const fetchSelf = async () => {
      const token = cookies.get("token");

      if (!token) return navigate("/login");

      const newSelf = await getSelf(token);

      console.log("new self:", newSelf);
      if (!newSelf) return navigate("/login");

      setSelf(newSelf);
    }

    fetchSelf();
  }, []);

  return { self };
}

export default useSelf;

