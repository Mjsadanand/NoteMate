import { useState } from "react";
import PropTypes from "prop-types";
import "./styles.css";
import Card from "./Card.jsx";

function Subjects({ subjects, setSelectedSubject, fetchSubjects }) {
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
    fetchSubjects(); // Refresh subjects
  };

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="subjects-container p-6">
      <div className="search-bar mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search subjects..."
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div className="resource-link mb-6 bg-yellow-100 p-4 rounded-lg flex items-center justify-between">
        <div>
          <span className="blinking-text font-bold text-red-600 mr-2" style={{ animation: "blinking 1.5s infinite" }}>New!</span>
          <span className="resource-title font-semibold">Resource for all Placement Drive</span>
        </div>
        <button
          className="visit-button bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          onClick={() => window.open("https://drive.google.com/drive/folders/1Fqr4QWLOkQm_XXRIXnmCfudfg5R5Q3uU", "_blank")}
        >
          Visit
        </button>
      </div>

      {/* Uncomment below if needed:
      <div className="add-subject mb-6">
        <input
          type="text"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          placeholder="Enter subject name"
          className="p-2 border rounded-md mr-2"
        />
        <button onClick={createSubject} className="bg-blue-600 text-white px-4 py-2 rounded">Create Subject</button>
      </div> 
      */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-4 place-items-center">
        {filteredSubjects.map((subject) => (
          <div
            key={subject._id}
            className="subject-card text-center cursor-pointer"
            onClick={() => setSelectedSubject(subject)}
          >
            <Card title={subject.name} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Prop types validation
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
