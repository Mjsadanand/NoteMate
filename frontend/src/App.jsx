import Admin from './components/Admin.jsx';
import AdminLogin from './components/AdminLogin.jsx';
import Home from './components/Home.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Files from './components/Files.jsx';


function App() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch("https://notemate-mnyf.onrender.com/api/subjects");
        if (!response.ok) throw new Error("Failed to fetch subjects.");
        const data = await response.json();
        setSubjects(data);
      } catch (error) {
        console.error("Error fetching subjects:", error.message);
      }
    };
    fetchSubjects();
  }, []);

  return ( 
    <Router>
      <Routes>
        <Route path="/" element={<Home subjects={subjects} />}/>
        <Route path="/unknown" element={<Admin />}/> 
        <Route path="/login" element={<AdminLogin />}/> 
        {subjects.map(subject => (
          <Route 
            key={subject._id}
            path={`/${subject.name.toLowerCase().replace(/\s+/g, '-')}`}
            element={<Files subject={subject} setSelectedSubject={() => {}} />}
          />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
