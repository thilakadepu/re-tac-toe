import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import PlayerRegistration from "./components/PlayerRegistration/PlayerRegistration"
import Background from "./components/Background/background";
import NotFoundPage from "./components/NotFoundPage/NotFoundPage";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./context/RequireAuth";
import Room from "./components/Room/Room";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Background />
        <Routes>
          <Route path="/" element={<PlayerRegistration />}/>
          <Route path="/room/:roomId" element={<Room />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}