import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Room } from "./pages/room";
import { Welcome } from "./pages/welcome";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/:roomId" element={<Room />} />
      </Routes>
    </Router>
  );
}

export default App;
