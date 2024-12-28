import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./styles.css";

function Files({ subject, setSelectedSubject }) {
  const [files, setFiles] = useState([]);
  const [fileInput, setFileInput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch files for a subject
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(
          `https://notemate-mnyf.onrender.com/api/subjects/${subject._id}`
        );
        if (!response.ok) throw new Error("Failed to fetch files.");
        const data = await response.json();
        setFiles(data.files || []);
      } catch (error) {
        console.error("Error fetching files:", error.message);
        setFiles([]);
      }
    };
    fetchFiles();
  }, [subject]);

  // Upload a file to the server
  const uploadFile = async () => {
    if (!fileInput) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileInput);

    setIsLoading(true);

    try {
      const response = await fetch(
        `https://notemate-mnyf.onrender.com/api/subjects/${subject._id}/files`,
        { method: "POST", body: formData }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to upload file.");
      }

      const updatedSubject = await response.json();
      setFiles(updatedSubject.files || []);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error.message);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="files-container">
      <h2 className="files-header">Notes for {subject.name}</h2>
      <button className="btn" onClick={() => setSelectedSubject(null)}>
        Back
      </button>
      <div className="files-list">
        {files && files.length > 0 ? (
          files.map((file) => (
            <div key={file.fileId} className="file-card">
              <a href={file.link} target="_blank" rel="noopener noreferrer">
                {file.name}
              </a>
            </div>
          ))
        ) : (
          <p>No files available.</p>
        )}
      </div>
      <div className="file-upload">
        <input
          type="file"
          onChange={(e) => setFileInput(e.target.files[0])}
        />
        <button onClick={uploadFile}>Upload</button>
      </div>
      {isLoading && (
        <div className="loader-popup">
          <div className="loader"></div>
          <p>Uploading...</p>
        </div>
      )}
    </div>
  );
}

Files.propTypes = {
  subject: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  setSelectedSubject: PropTypes.func.isRequired,
};

export default Files;
