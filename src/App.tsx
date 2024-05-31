import LoginSignup from './components/CourseMeow/LoginSignup';
import { Route, Routes, Router } from "react-router-dom";
import Timetable from "./components/CourseMeow/Timetable";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<LoginSignup />} />
                <Route path="/timetable" element={<Timetable />} />
            </Routes>
        </div>
    )
}

export default App;