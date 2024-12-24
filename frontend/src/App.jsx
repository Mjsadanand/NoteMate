import Admin from './components/Admin.jsx';
import Home from './components/Home.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  return ( 
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/unknown" element={<Admin />}/> 
      </Routes>
    </Router>
  );
}

export default App;
