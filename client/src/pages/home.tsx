import { Link } from "react-router-dom";

function Home() {
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
