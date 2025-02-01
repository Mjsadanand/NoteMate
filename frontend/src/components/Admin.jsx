import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import './styles.css'

function Admin({ fetchSubjects }) {
    const [newSubject, setNewSubject] = useState("");
    const [subjectsInfo, setSubjectsInfo] = useState(null);

    const createSubject = async () => {
        if (!newSubject.trim()) return alert("Subject name is required.");
        await fetch("http://localhost:8000/api/subjects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newSubject }),
        });
        setNewSubject("");
        fetchSubjects();
        fetchSubjectsInfo(); // Refresh subject info after creating a new subject
    };

    const fetchSubjectsInfo = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/subjects/info");
            if (!response.ok) {
                throw new Error("Failed to fetch subjects info");
            }
            const data = await response.json();
            setSubjectsInfo(data);
        } catch (error) {
            console.error("Error fetching subjects info:", error.message);
        }
    };

    useEffect(() => {
        fetchSubjectsInfo(); 
    }, []);

    return (
        <div>
            <header className="app-header">
                <h1 className="app-title">Notemate</h1>
                <div className="app-para" style={{textAlign:"center",color:"blue"}}>Admin Panel</div>
            </header>
            <div className="add-subject" style={{ margin: "80px" }}>
                <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="Enter subject name"
                />
                <button onClick={createSubject}>Create Subject</button>
            </div>
            <div className="subjects-info">
                {subjectsInfo ? (
                    <div>
                        <h2 className="analytics-header">Total Subjects: {subjectsInfo.totalSubjects}</h2>
                        <table className="subjects-table">
                            <thead>
                                <tr>
                                    <th>Subject Name</th>
                                    <th>Notes Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subjectsInfo.subjects.map((subject) => (
                                    <tr key={subject._id}>
                                        <td>{subject.name}</td>
                                        <td>{subject.notesCount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="loading-text">Loading subjects information...</p>
                )}
            </div>

        </div>
    );
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

export default Admin;
