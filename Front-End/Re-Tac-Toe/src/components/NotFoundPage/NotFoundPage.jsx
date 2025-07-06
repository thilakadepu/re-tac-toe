import { useNavigate } from "react-router-dom";
import "./NotFoundPage.css";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <h1>Error 404 - Page Not Found</h1>
      <button onClick={() => navigate("/")}>Go to Registration Page</button>
    </div>
  );
}
