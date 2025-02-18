import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./styles.css";
import image from "../assets/sample1.png";

function Files({ subject, setSelectedSubject }) {
  const [files, setFiles] = useState([]);
  const [fileInput, setFileInput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
      setFiles(updatedSubject.subject.files || []);
    } catch (error) {
      console.error("Error uploading file:", error.message);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="files-container">
      <button onClick={() => setSelectedSubject(null)} className="but">
        <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024"><path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path></svg>
        <span>Back</span>
      </button>
      <h3 className="files-header">{subject.name}</h3>
      {/* <button className="btn" onClick={() => setSelectedSubject(null)}>
        <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024"><path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path></svg>
        Back
      </button> */}

      <div className="files-list">
        {files.length > 0 ? (
          files.map((file) => (
            <div key={file.fileId} className="file-card">
              <img
                src={image}
                alt="File Icon"
                className="file-icon"
              /> 
              <a
                href={file.link}
                target="_blank"
                rel="noopener noreferrer"
                className="file-name"
              >
                {/* {file.name} */}
                {file.name.split('.').slice(0, -1).join('.')}
              </a> <br />
              <button style={{ backgroundColor: "transparent", color: "black" }}
                className="buttonDownload"
                onClick={() => window.open(file.link, "_blank")}
              >
              </button>
            </div>

          ))
        ) : (
          <p>No files? No problem! You can add some soon.</p>
        )}
      </div>
      <div className="file-upload">
        <input
          type="file"
          className="file-input"
          onChange={(e) => setFileInput(e.target.files[0])}
        />
        {/* <button className="upload-button" onClick={uploadFile}>
          Upload
        </button> */}
        <button onClick={uploadFile} className="butt">
          <div className="svg-wrapper-1">
            <div className="svg-wrapper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path
                  fill="currentColor"
                  d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                ></path>
              </svg>
            </div>
          </div>
          <span>Send</span>
        </button>

      </div>
      {isLoading && (
        <div className="loader-container"><div className="loader">
          <svg viewBox="0 0 80 80">
            <circle r="32" cy="40" cx="40" id="test"></circle>
          </svg>
        </div><div className="loader triangle">
            <svg viewBox="0 0 86 80">
              <polygon points="43 8 79 72 7 72"></polygon>
            </svg>
          </div><div className="loader">
            <svg viewBox="0 0 80 80">
              <rect height="64" width="64" y="8" x="8"></rect>
            </svg>
          </div></div>
      )}
      <br /> <br />
      <div className="notifications-container">
        <div className="info">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="info-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
              </svg>
            </div>
            <div className="info-prompt-wrap">
              <p className="">
                Maximum file size is 10MB. Supported file types is only PDF.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="notifications-container">
        <div className="alert">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 alert-svg">
                <path clipRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" fillRule="evenodd"></path>
              </svg>
            </div>
            <div className="alert-prompt-wrap">
              <p className="text-sm text-yellow-700">
                If your files are not in the PDF format, you can convert them into PDF format and then upload.
                <a className="alert-prompt-link" href="https://www.ilovepdf.com/" target="_blank">Let convert</a>
              </p>
            </div>
          </div>
        </div>
      </div>
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
