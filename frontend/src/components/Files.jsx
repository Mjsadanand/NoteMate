import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { IoEye, IoDownload } from "react-icons"; 
import "./styles.css";

function Files({ subject, setSelectedSubject }) {
  const [files, setFiles] = useState([]);
  const [fileInput, setFileInput] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 

  // Fetch files for a subject
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`https://notemate-mnyf.onrender.com/api/subjects/${subject._id}`);
        if (!response.ok) throw new Error("Failed to fetch files.");
        const data = await response.json();
        console.log("Fetched data:", data);
        setFiles(data.files || []);
      } catch (error) {
        console.error("Error fetching files:", error.message);
        setFiles([]);
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
      console.log("Updated subject:", updatedSubject);
      setFiles(updatedSubject.files || []);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error.message);
      alert(error.message);
    } finally {
      setIsLoading(false); // Hide loader
    }
  };

  // Handle file download
  const handleDownload = (link) => {
    const a = document.createElement('a');
    a.href = link;
    a.download = link.split('/').pop(); // Use the file name for the download
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="files-container">
      <h2 className="files-header">Notes for {subject.name}</h2>
      <button className="btn" onClick={() => setSelectedSubject(null)}>
        <svg
          height="16"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          viewBox="0 0 1024 1024"
        >
          <path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path>
        </svg>
        <span>Back</span>
      </button>
      <div className="files-list">
        {files && files.length > 0 ? (
          files.map((file, index) => (
            <div key={`${file.fileId}-${index}`} className="file-card">
              <div className="file-info">
                <a href={file.link} target="_blank" rel="noopener noreferrer" className="file-link">
                  {file.name}
                </a>
                <div className="file-actions">
                  <button
                    onClick={() => handleDownload(file.link)}
                    title="Download"
                    className="action-btn download-btn"
                  >
                    <IoDownload />
                  </button>
                  <a href={file.link} target="_blank" rel="noopener noreferrer" className="action-btn view-btn" title="View">
                    <IoEye />
                  </a>
                </div>
              </div>
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
          Upload
        </button>
      </div>
      <div style={{ textAlign: "center", marginBottom: "80px" }}>
        (Only Allowed types are JPEG, PNG, PPT, PDF, DOC.)
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
