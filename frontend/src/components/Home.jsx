import { useState, useEffect } from "react";
import "./styles.css";
import Subjects from "./Subjects.jsx";
import Files from "./Files.jsx";
import Footer from "./Footer.jsx";

function Home() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const fetchSubjects = async () => {
    const response = await fetch("http://localhost:5000/api/subjects");
    const data = await response.json();
    setSubjects(data);
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Notemate</h1>
        <div className="app-para" style={{textAlign:"center",color:"blue"}}>Note sharing platform</div>
      </header>
      <main className="app-content">
        {!selectedSubject ? (
          <Subjects
            subjects={subjects}
            setSelectedSubject={setSelectedSubject}
            fetchSubjects={fetchSubjects}
          />
        ) : (
          <Files subject={selectedSubject} setSelectedSubject={setSelectedSubject} />
        )}
      </main>
        <Footer/>
    </div>
  );
}

export default Home;
