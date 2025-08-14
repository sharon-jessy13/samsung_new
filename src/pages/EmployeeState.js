import React from 'react';
import '../styles/EmployeeState.css';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import useProofDetailsForm from '../Hooks/useProofDetailsForm';
import noteicon from '../assets/noteicon.svg';
import AddressProof from '../components/AddressProof';
import NOC from '../components/NOC';
import OfficeCorrespondence from '../components/OfficeCorrespondence';

function EmployeeState({ instanceId, workflowState, setWorkflowState, onSubmit }) {
  const {
    letterTypes,
    letterType,
    setLetterType,
    addressType,
    setAddressType,
    reason,
    setReason,
    comment,
    setComment,
    permanentAddress,
    setPermanentAddress,
    currentAddress,
    setCurrentAddress,
    nocFromDate,
    setNocFromDate,
    nocToDate,
    setNocToDate,
    officeAddress,
    setOfficeAddress,
    isSubmitting,
    handleLetterTypeChange,
    handleSubmit,
  } = useProofDetailsForm({ instanceId, onSubmit });

  return (
    <div className="proof-details-container">
      {/* Header */}
      <div className="proof-header">
        <h2 className="proof-header-title">Proof Details</h2>
        <div className="proof-note">
          <img src={noteicon} />
        </div>
      </div>

      {/* Letter Type */}
      <div className="form-section">
        <label className="label">Type of Letter Required</label>
        <select
          value={letterType}
          onChange={handleLetterTypeChange}
          className="select-box"
        >
          <option value="">-- Select --</option>
          {letterTypes.map((type) => (
            <option key={type.lkeyvalue} value={type.letterType}>
              {type.letterType}
            </option>
          ))}
        </select>
      </div>

      {/* NOC Dates */}
      {letterType === 'No Objection Certificate' && (
        <>
          <div className="form-section">
            <label className="label">Leave From</label>
            <input
              type="date"
              value={nocFromDate}
              onChange={(e) => setNocFromDate(e.target.value)}
              className="select-box"
            />
          </div>
          <div className="form-section">
            <label className="label">Leave To</label>
            <input
              type="date"
              value={nocToDate}
              onChange={(e) => setNocToDate(e.target.value)}
              className="select-box"
            />
          </div>
        </>
      )}

      {/* Conditional Sections */}
      {letterType === 'Address Proof' && (
        <AddressProof
          permanentAddress={permanentAddress}
          setPermanentAddress={setPermanentAddress}
          currentAddress={currentAddress}
          setCurrentAddress={setCurrentAddress}
          addressType={addressType}
          setAddressType={setAddressType}
        />
      )}
      {letterType === 'No Objection Certificate' && <NOC />}
      {letterType === 'Office Correspondence Letter' && (
        <OfficeCorrespondence
          officeAddress={officeAddress}
          setOfficeAddress={setOfficeAddress}
        />
      )}

      {/* Reason */}
      <div className="form-section">
        <label className="label">Letter required for (Reason)</label>
        <textarea
          required
          minLength={3}
          placeholder=" "
          className="textarealabel"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </div>

      {/* Comment */}
      <div className="form-section">
        <label className="label">Comment (Max 500 Chars)</label>
        <textarea
          placeholder="xxx-xxx-xx-xxx-x"
          maxLength={500}
          className="textareacomment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <div className="form-submit">
        <button
          type="button"
          className="submit-button"
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>

      {/* View Policies */}
      <div className="view-policies">
        <DescriptionOutlinedIcon className="policy-icon" />
        <a href="#" className="policy-link">
          View Policies
        </a>
      </div>
    </div>
  );
}

export default EmployeeState;
