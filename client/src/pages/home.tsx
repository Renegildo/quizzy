import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// TODO: add a landing page

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/app");
  }, []);

  return (
    <div>
      <p>
        This is a landing page
      </p>
      <Link to='/app'>
        Get started
      </Link>
    </div>
  );
}

export default Home;
