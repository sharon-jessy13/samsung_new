import React, { useState } from "react";
import "../styles/NOC.css"   // Import CSS file
import useProofDetailsForm from "../Hooks/useProofDetailsForm";

const NOC = () => {
  const [files, setFiles] = useState([]);

  // const handleFileUpload = (event) => {
  //   const uploadedFiles = Array.from(event.target.files);
  //   const pdfFiles = uploadedFiles.map((file) => ({
  //     name: file.name,
  //     size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
  //     type: file.type,
  //     date: new Date().toLocaleDateString(),
  //     time: new Date().toLocaleTimeString(),
  //     fileUrl: URL.createObjectURL(file),
  //   }));
  //   setFiles((prev) => [...prev, ...pdfFiles]);
  // };

  // const handleDelete = (index) => {
  //   setFiles(files.filter((_, i) => i !== index));
  // };

  const{
    handleDelete,
    handleFileUpload,
  }=useProofDetailsForm();

  return (
    <div className="file-upload-container">
      {/* Upload Section */}
      <div className="upload-card">
        <input
          type="file"
          id="fileInput"
          accept="application/pdf"
          multiple
          hidden
          onChange={handleFileUpload}
        />
        <label htmlFor="fileInput" className="upload-label">
          <div className="upload-icon">⬆️</div>
          <div>
            <p>Choose a File</p>
            <small>PDF format • Max. 4MB</small>
          </div>
        </label>
        <button className="upload-btn">Upload</button>
      </div>

      {/* File Preview Section */}
      <div className="file-preview-section">
        {files.map((file, index) => (
          <div key={index} className="file-card">
            <div className="file-icon">📄</div>
            <div className="file-info">
              <p className="file-name">{file.name}</p>
              <small>
                {file.date} | {file.time} | {file.size}
              </small>
            </div>
            <a
              href={file.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="view-btn"
            >
              View
            </a>
            <button
              className="delete-btn"
              onClick={() => handleDelete(index)}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NOC;