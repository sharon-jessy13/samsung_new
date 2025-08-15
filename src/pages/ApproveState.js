import { useState, useEffect } from "react";
import { getHRLetterDetailsByInstanceID } from "../services/apiclient";
import { useNavigate, useParams } from 'react-router-dom';
import HrHeader from '../components/HrHeader';
import  TranferWorkflow from '../assets/TransferWorkflow.svg';
import useProofDetailsForm from '../Hooks/useProofDetailsForm';

function ApproveState() {
  const [loading, setLoading] = useState(true);
  const [letterData, setLetterData] = useState(null);
  const [approverComment, setApproverComment] = useState("");
  const { instanceID } = useParams();

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
    } = useProofDetailsForm({ instanceId: instanceID });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getHRLetterDetailsByInstanceID(instanceID);
        setLetterData(data);
      } catch (error) {
        console.error("Error fetching letter details:", error);
      }
      setLoading(false);
    }
    if (instanceID) {
      fetchData();
    }
  }, [instanceID]);

  const handleAction = async (action) => {
    if (!letterData) return;
    const payload = {
      instanceID,
      action,
      approverComment,
    };
    console.log("Approval payload:", payload);
    // Call updateHRLetterApproval(payload) here if needed
    alert(`Letter ${action} successfully!`);
  };

  if (loading) return <div>Loading...</div>;
  if (!letterData) return <div>No data found for this request.</div>;

  const handleApprove = () => {
    console.log("Approve clicked with data:", {
      letterType,
      permanentAddress,
      currentAddress,
      addressType,
      reason,
      comment,
    });
  };

  const handleReject = () => {
    console.log("Reject clicked with data:", {
      letterType,
      permanentAddress,
      currentAddress,
      addressType,
      reason,
      comment,
    });
  };

  const handleRestart = () => {
    setComment("");
  };

  
  return (
    <div className="form-container">
      {/* Proof Details */}
      <h3 className="section-title">Proof Details</h3>
      <div className="form-group">
        <label>Type of Letter Required</label>
        <select value={letterType} onChange={(e) => setLetterType(e.target.value)}>
          <option>Address Proof</option>
          <option>Employment Certificate</option>
          <option>No Objection Certificate</option>
          <option>OfficeCorrespondence</option>
        </select>
      </div>

      {/* Personal Details */}
      <h3 className="section-title">Personal Details</h3>
      <div className="address-grid">
        <div className="form-group">
          <label>Permanent Address</label>
          <input
            type="text"
            value={permanentAddress}
            onChange={(e) => setPermanentAddress(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Current Address</label>
          <input
            type="text"
            value={currentAddress}
            onChange={(e) => setCurrentAddress(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Letter required for Permanent or Current Address</label>
          <select
            value={addressType}
            onChange={(e) => setAddressType(e.target.value)}
          >
            <option>Permanent</option>
            <option>Current</option>
          </select>
        </div>
      </div>

      {/* Reason */}
      <div className="form-group">
        <label>Letter required for Reason</label>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </div>

      {/* Comment */}
      <div className="form-group">
        <label>Comment (Max 500 Chars)</label>
        <textarea
          rows="3"
          maxLength="500"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div className="button-group">
        <button className="btn btn-outline" onClick={handleRestart}>
          Restart
        </button>
        <button className="btn btn-reject" onClick={handleReject}>
          Reject
        </button>
        <button className="btn btn-approve" onClick={handleApprove}>
          Approve
        </button>
      </div>

      <hr />

      {/* Transfer Workflow */}
      <div className="transfer-workflow">
        <img src={TranferWorkflow} alt=" "></img>
      </div>

      {/* View Policies */}
      <div className="view-policies">View Policies</div>
    </div>
  );
}
export default ApproveState;
