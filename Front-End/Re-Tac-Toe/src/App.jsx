import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import PlayerRegistration from "./components/PlayerRegistration/PlayerRegistration"
import Background from "./components/Background/background";
import NotFoundPage from "./components/NotFoundPage/NotFoundPage";

export default function App() {
  return (
      <Router>
        <Background />
        <Routes>
          <Route path="/" element={<PlayerRegistration />}/>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
  )
}