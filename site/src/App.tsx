import "./App.scss";
import DashBoard from "./Pages/dashboard";
import Login from "./Pages/login";
import { Routes, Route } from "react-router-dom";
import Register from "./Pages/register";
import Navbar from "./Components/navbar";
import { useState } from "react";
import Content from "./Pages/content";


function App() {
    const [page, setPage] = useState("dashboard");
    return (
        <div className="app">
            {!["login", "register"].includes(page) && <Navbar page={page} />}
            <Routes>
                <Route path="/" element={<DashBoard setPage={setPage} />} />
                <Route path="/login" element={<Login setPage={setPage} />} />
                <Route
                    path="/register"
                    element={<Register setPage={setPage} />}
                />
                <Route path="/contents/:id" element={<Content />} />
            </Routes>
        </div>
    );
}

export default App;
