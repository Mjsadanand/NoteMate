import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./styles.css";

function Files({ subject, setSelectedSubject }) {
  const [files, setFiles] = useState([]); // Initialize as an empty array
  const [fileInput, setFileInput] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/subjects/${subject._id}`);
        if (!response.ok) throw new Error("Failed to fetch files.");
        const data = await response.json();
        console.log('Fetched data:', data); // Debug the response
        setFiles(data.files || []);
      } catch (error) {
        console.error("Error fetching files:", error.message);
        setFiles([]); // Fallback to an empty array on error
      }
    };
    fetchFiles();
  }, [subject]);

  const uploadFile = async () => {
    if (!fileInput) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileInput);

    try {
      const response = await fetch(
        `http://localhost:5000/api/subjects/${subject._id}/files`,
        { method: "POST", body: formData }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to upload file.");
      }

      const updatedSubject = await response.json();
      console.log('Updated subject:', updatedSubject); // Debug the response
      setFiles(updatedSubject.files || []); // Fallback to an empty array
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error.message);
      alert(error.message);
    }
  };


  return (
    <div className="files-container">
      <h2 className="files-header">Notes for {subject.name}</h2>
      <button className="btn" onClick={() => setSelectedSubject(null)}>
        <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024"><path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path></svg>
        <span>Back</span>
      </button>
      <div className="files-list">
        {files && files.length > 0 ? (
          files.map((file, index) => (
            <div key={`${file.fileId}-${index}`} className="file-card">
              <strong className="file-title">{file.title}</strong>
              <a href={file.link} target="_blank" rel="noopener noreferrer" className="file-link">
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
          className="file-input"
          onChange={(e) => setFileInput(e.target.files[0])}
        />
        <button className="upload-button" onClick={uploadFile}>
          Upload File
        </button>
      </div>
      <div style={{textAlign:"center",marginBottom:"80px"}}>(Only Allowed types are JPEG, PNG, PDF, DOC, DOCX.)</div>
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
