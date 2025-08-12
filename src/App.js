import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import CreateJob from "./pages/CreateJob";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Login from "./pages/Login";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
// import './index.css'

function App() {
  return (
    <Router>
      <Header/>
      <Routes>
       <Route path="/" element={<Home/>}/>
       <Route path="/create" element={<CreateJob/>}/>
       <Route path="/dashboard" element={<Dashboard/>}/>
       <Route path="/register" element={<Register/>} />
       <Route path="/login" element={<Login/>} />

      </Routes>
      <ToastContainer position="top-right" autoClose={4000}/>
    </Router>
  )
}

export default App