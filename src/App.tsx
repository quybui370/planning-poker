import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Room } from "./pages/room";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/planning-poker" element={<Room />} />
      </Routes>
    </Router>
  );
}

export default App;
