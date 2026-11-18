import { Link } from "react-router-dom";
import { KiteMark } from "../components/Logo.jsx";
import "./NotFound.css";

function NotFound() {
  return (
    <section className="container notfound">
      <div className="lost-kite">
        <KiteMark size={110} />
      </div>
      <h1>404</h1>
      <p>This kite flew off course. The page you are looking for does not exist.</p>
      <Link to="/" className="btn btn-red">
        Back home
      </Link>
    </section>
  );
}

export default NotFound;
