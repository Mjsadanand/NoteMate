import { useState } from "react";
import PropTypes from "prop-types";
import "./styles.css";
import subjectImage from "../assets/Subject.png";

function Subjects({ subjects, setSelectedSubject }) {
  const [newSubject, setNewSubject] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // eslint-disable-next-line no-unused-vars
  const createSubject = async () => {
    if (!newSubject.trim()) return alert("Subject name is required.");
    await fetch("https://notemate-mnyf.onrender.com/api/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newSubject }),
    });
    setNewSubject("");
    // eslint-disable-next-line no-undef
    fetchSubjects();   
  };

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="subjects-container">
      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search subjects..."
        />
      </div>
      <div>
        <div className="resource-link">
          <span className="blinking-text" style={{ animation: "blinking 1.5s infinite" }}>New!</span>
          <span className="resource-title">Resource for all Placement Drive</span>
          <button
            className="visit-button"
            onClick={() => window.open("https://drive.google.com/drive/folders/1Fqr4QWLOkQm_XXRIXnmCfudfg5R5Q3uU", "_blank")}
          >
            Visit
          </button>
        </div>
      </div>
      {/* <div className="add-subject"> 
        <input
          type="text"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          placeholder="Enter subject name"
        />
        <button onClick={createSubject}>Create Subject</button>
      </div> */}
      <div className="subjects-grid">
        {filteredSubjects.map((subject) => (
          <div
            key={subject._id}
            className="subject-card"
            onClick={() => setSelectedSubject(subject)}
          >
            {/* <img src={`https://via.placeholder.com/150?text=${subject.name}`} alt={subject.name} className="subject-image" /> */}
            <img src={subjectImage} alt={subject.name}/>
            <h3>{subject.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

// Add PropTypes
Subjects.propTypes = {
  subjects: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  setSelectedSubject: PropTypes.func.isRequired,
  fetchSubjects: PropTypes.func.isRequired,
};

export default Subjects;
