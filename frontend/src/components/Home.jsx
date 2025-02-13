import { useState, useEffect } from "react";
import "./styles.css";
import Subjects from "./Subjects.jsx";
import Files from "./Files.jsx"; 
import Footer from "./Footer.jsx";
import Image from "../assets/image.png";

function Home() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const fetchSubjects = async () => {
    const response = await fetch("https://notemate-mnyf.onrender.com/api/subjects");
    const data = await response.json();
    setSubjects(data);
  };

  useEffect(() => {
    fetchSubjects();
  }, []);
 
  function navigateToLogin() {
    window.location.href = '/login'; 
}
  return (
    <div className="app-container">
      <header className="app-header">
      <div className="flex"> <h1 className="app-title" style={{color:"yellow"}}>Note<h1 className="app-title" style={{color:"blue"}}>mate</h1></h1> 
      <img src={Image} alt="Image here" onClick={() => window.location.href = 'https://learn.kletech.ac.in/login'} className="img" />
      <button className="button" style={{textAlign:"right",marginRight:"19px"}} onClick={navigateToLogin} >Admin</button></div> 
        <div className="app-para" >A study material sharing platform</div>
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
