import { useEffect, useState } from "react";
import { getUser } from "../utils/api";
import { useParams } from "react-router-dom";

import { User } from "../utils/types";

const UserPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState<null | User>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;

      const newUser = await getUser(id);
      setUser(newUser);
    }
    fetchUser();
  }, []);

  return (
    <p>
      {user?.username}
    </p>
  );
}

export default UserPage;
