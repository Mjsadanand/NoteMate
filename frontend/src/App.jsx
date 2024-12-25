import Admin from './components/Admin.jsx';
import AdminLogin from './components/AdminLogin.jsx';
import Home from './components/Home.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  return ( 
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/unknown" element={<Admin />}/> 
        <Route path="/login" element={<AdminLogin />}/> 
      </Routes>
    </Router>
  );
}

export default App;
