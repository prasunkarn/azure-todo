import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Todo from "./components/Todo";

function App() {
  const appStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const cardStyle = {
    backdropFilter: "blur(10px)",
    background: "rgba(255, 255, 255, 0.08)",
    padding: "30px",
    borderRadius: "15px",
    width: "90%",
    maxWidth: "1000px",
    color: "white",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  };

  return (
    <div style={appStyle}>
      <div style={cardStyle}>
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          🚀 Todo Dashboard
        </h1>

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Todo />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
