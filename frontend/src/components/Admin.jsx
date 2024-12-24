import { useState } from "react";
import PropTypes from "prop-types";

function Admin({ fetchSubjects }) {
    const [newSubject, setNewSubject] = useState("");

    const createSubject = async () => {
        if (!newSubject.trim()) return alert("Subject name is required.");
        await fetch("http://localhost:5000/api/subjects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newSubject }),
        });
        setNewSubject("");
        fetchSubjects();
    };
    return (
        <div>
            <header className="app-header">
                <h1 className="app-title">Notemate</h1> 
            </header>
            <div className="add-subject" style={{ margin: "100px" }}>
                <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="Enter subject name"
                />
                <button onClick={createSubject}>Create Subject</button>
            </div>
        </div>
    )
}

Admin.propTypes = {
    subjects: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    setSelectedSubject: PropTypes.func.isRequired,
    fetchSubjects: PropTypes.func.isRequired,
};

export default Admin
