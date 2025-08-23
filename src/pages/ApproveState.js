import { useState, useEffect } from "react";
import { getHRLetterDetailsByInstanceID } from "../services/apiclient";
import { useNavigate, useParams } from 'react-router-dom';
import HrHeader from '../components/HrHeader';
import TranferWorkflow from '../assets/TransferWorkflow.svg';
import useProofDetailsForm from '../Hooks/useProofDetailsForm';
import avthar from '../assets/avthar.svg';
import {
  Box,
  Grid,
  Typography,
  Avatar,
  Divider,
  IconButton,
  Container,
} from '@mui/material';
import { ArrowBack, AlarmOn, Assignment } from '@mui/icons-material';

function ApproveState() {
  const [loading, setLoading] = useState(true);
  const [letterData, setLetterData] = useState(null);
  const [approverComment, setApproverComment] = useState("");
  const { instanceId } = useParams();
  const navigate = useNavigate();
  const [workflowState, setWorkflowState] = useState('Initiate');
  const employee = {
    name: "Manoj Kandan M",
    genId: "25504878",
    email: "manoj.kandan@partner.samsung.com",
    designation: "Outsourcing",
    division: "Tech Strategy Team\\Smart Infra Group\\Information System & AI Tools",
    manager: "Ravindra S R (06786669)",
    avatar: "/avatar.png"
  }
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
  } = useProofDetailsForm({ instanceId: instanceId });

  useEffect(() => {
    async function fetchData() {
      if (!instanceId) return;

      try {
        const letterDetails = await getHRLetterDetailsByInstanceID(instanceId);
        console.log("Fetched letter details:", letterDetails);
        setLetterData(letterDetails);
      } catch (err) {
        console.error("Error fetching letter:", err);
      }
    }
    fetchData();
  }, [instanceId]);

  const handleAction = async (action) => {
    if (!letterData) return;
    const payload = {
      instanceId,
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
    <Box className="hr-header-container">
      <Typography variant="caption" className="breadcrumb">
        My Workspace &gt; HR Letter
      </Typography>

      <Box className="header-row">
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton size="small">
            <ArrowBack />
          </IconButton>
          <Typography variant="body2">HR Request.{workflowState} </Typography>

        </Box>
        <AlarmOn className="clock-icon" />
      </Box>
      <Grid container alignItems="center">
        {/* Employee Details */}

        <div class="employee-details">
          <div class="avatar-wrapper">
            <img src={avthar} class="avatar" />
            <span class="online-indicator"></span>
          </div>
          <div class="employee-info">
            <strong>{employee.name} • Gen ID: {employee.genId}</strong>
            <div class="employee-email">{employee.email}</div>
          </div>
        </div>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* Designation */}
        <Grid item xs={12} sm="auto" sx={{ px: 2 }}>
          <Typography variant="body2" color="text.secondary">Designation</Typography>
          <Typography fontWeight="bold">{employee.designation}</Typography>
        </Grid>

        {/* Divider */}

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />


        {/* Division */}
        <Grid item xs={12} sm="auto" sx={{ px: 2 }}>
          <Typography variant="body2" color="text.secondary">Division</Typography>
          <Typography fontWeight="bold">{employee.division}</Typography>
        </Grid>

        {/* Divider */}

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />


        {/* Manager */}
        <Grid item xs={12} sm="auto" sx={{ px: 2 }}>
          <Typography variant="body2" color="text.secondary">Manager</Typography>
          <Typography fontWeight="bold">{employee.manager}</Typography>
        </Grid>
      </Grid>

      <Box className="required-info-section">
        <Assignment className="required-info-icon" />
        <Typography fontWeight="bold" className="required-info-text">
          Required Information
        </Typography>
      </Box>


      <div className="form-container">
        {/* Proof Details */}
        <h3 className="section-title">Proof Details</h3>
        <div className="field">
          <label>Type of Letter Required</label>
          <select placeholder={letterType} onChange={(e) => setLetterType(e.target.value)}>
            {/* <option>Address Proof</option>
            <option>Employment Certificate</option>
            <option>No Objection Certificate</option>
            <option>OfficeCorrespondence</option> */}
          </select>
        </div>
        {letterType === 'Address Proof' && (
          <div>
            {/*Personal Details */}
            <h3 className="section-title">Personal Details</h3>
            <div className="address-grid">
              <div className="field">
                <label>Permanent Address</label>
                <input
                  type="text"
                  placeholder={permanentAddress}
                  onChange={(e) => setPermanentAddress(e.target.value)}
                />
              </div>
              <div className="field">
                <label>Current Address</label>
                <input
                  type="text"
                  placeholder={currentAddress}
                  onChange={(e) => setCurrentAddress(e.target.value)}

                />
              </div>
              <div className="field">
                <label>Letter required for Permanent or Current Address</label>
                <select
                  placeholder={addressType}
                  onChange={(e) => setAddressType(e.target.value)}
                >

                </select>
              </div>
            </div>
          </div>
        )}

        {letterType === 'No Objection Certificate' && (
          <>
            <div className="field">
              <label className="label">Leave From</label>
              <input
                type="date"
                placeholder={nocFromDate}
                onChange={(e) => setNocFromDate(e.target.value)}
                className="select-box"
              />
            </div>
            <div className="field">
              <label className="label">Leave To</label>
              <input
                type="date"
                placeholder={nocToDate}
                onChange={(e) => setNocToDate(e.target.value)}
                className="select-box"
              />
            </div>
            <div className="field">
              <label className="label">Attachment</label>
              {file ? (
                <div className="attachment-box">
                  <div className="attachment-icon">PDF</div>
                  <div className="attachment-details">
                    <span>{file.name}</span>
                    <span className="attachment-meta">
                      {new Date().toLocaleDateString()} • {(file.size / (1024 * 1024)).toFixed(1)}MB
                    </span>
                  </div>
                  <a
                    href={URL.createObjectURL(file)}
                    download={file.name}
                    className="btn-download"
                  >
                    ⬇ Download
                  </a>
                  <a
                    href={URL.createObjectURL(file)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-download"
                    style={{ marginLeft: "10px" }}
                  >
                    View
                  </a>
                </div>
              ) : (
                <input
                  type="file"
                  accept=".pdf,.jpg,.png"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              )}
            </div>


          </>
        )}
        {letterType === 'Office Correspondence' && (
          <div className="form-group">
            <label>Office Address of Correspondence (Use ‘ , ’ for separation)</label>
            <input
              type="text"
              placeholder={officeAddress}
              onChange={(e) => setOfficeAddress(e.target.value)}
            />
          </div>

        )}
        {/* Reason */}
        <div className="form-group">
          <label>Letter required for Reason</label>
          <input
            type="text"
            placeholder={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        {/* Comment */}
        <div className="form-group">
          <label>Comment (Max 500 Chars)</label>
          <textarea
            rows="3"
            maxLength="500"
            placeholder={comment}

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
        <div className="view-policies">View Policies</div>
      </div>
    </Box >
  );
}
export default ApproveState;










// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Grid,
//   Typography,
//   Avatar,
//   Divider,
//   IconButton,
//   Container,
//   Button,
//   TextField,
// } from "@mui/material";
// import { ArrowBack } from "@mui/icons-material";
// import { useNavigate, useParams } from "react-router-dom";
// import avthar from "../assets/avthar.svg";
// import online from "../assets/Avatar online indicator.svg";
// import {
//   getHRLetterDetailsByInstanceID,
//   updateHRLetterApproval
// } from "../services/apiclient";
// import useProofDetailsForm from "../Hooks/useProofDetailsForm";
// import "../styles/ApproveState.css";

// export default function ApproveState() {
//   const [loading, setLoading] = useState(true);
//   const [employee, setEmployee] = useState(null);
//   const [approverComment, setApproverComment] = useState("");

//   const { instanceId } = useParams();
//   const cleanInstanceId = instanceId?.replace(":", ""); // remove ":" before fetch
//   const navigate = useNavigate();

//   const {
//     letterType,
//     setLetterType,
//     addressType,
//     setAddressType,
//     reason,
//     setReason,
//     comment,
//     setComment,
//     permanentAddress,
//     setPermanentAddress,
//     currentAddress,
//     setCurrentAddress,
//     nocFromDate,
//     setNocFromDate,
//     nocToDate,
//     setNocToDate,
//     officeAddress,
//     setOfficeAddress,
//     isSubmitting,
//     handleLetterTypeChange,
//     handleSubmit,
//   } = useProofDetailsForm({ instanceId: cleanInstanceId });

//   useEffect(() => {
//     async function fetchData() {
//       if (!cleanInstanceId) return;

//       try {
//         const res = await getHRLetterDetailsByInstanceID(cleanInstanceId);
//         console.log("Fetched letter details:", res);

//         if (res?.data && res.data.length > 0) {
//           const details = res.data[0];

//           setEmployee({
//             name: details.fullName,
//             genId: details.genID,
//             email: details.email || "",
//             designation: details.designation,
//             division: details.division || "",
//             manager: details.manager || "",
//           });

//           setLetterType(details.letterType || "");
//           setPermanentAddress(details.permanentAddress || "");
//           setCurrentAddress(details.currentAddress || "");
//           setAddressType(details.letterRequiredOnCurrentOrPermanentAdd || "");
//           setReason(details.reason || "");
//           setComment(details.comment || "");
//           setNocFromDate(details.nocFromDate || "");
//           setNocToDate(details.nocToDate || "");
//           setOfficeAddress(details.officeAddress || "");
//         }
//       } catch (err) {
//         console.error("Error fetching letter:", err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchData();
//   }, [cleanInstanceId]);

//   const handleApprove = async () => {
//     try {
//       await updateHRLetterApproval({
//         instanceId: cleanInstanceId,
//         status: "Approved",
//         approverComment,
//       });
//       navigate("/approvals");
//     } catch (err) {
//       console.error("Error approving letter:", err);
//     }
//   };

//   const handleReject = async () => {
//     try {
//       await updateHRLetterApproval({
//         instanceId: cleanInstanceId,
//         status: "Rejected",
//         approverComment,
//       });
//       navigate("/approvals");
//     } catch (err) {
//       console.error("Error rejecting letter:", err);
//     }
//   };

//   if (loading) {
//     return <Typography>Loading...</Typography>;
//   }

//   return (
//     <Container maxWidth="lg" className="approve-container">
//       {/* Header */}
//       <Box display="flex" alignItems="center" mb={2}>
//         <IconButton onClick={() => navigate(-1)}>
//           <ArrowBack />
//         </IconButton>
//         <Typography variant="h5" fontWeight="bold" ml={1}>
//           Approve HR Letter Request
//         </Typography>
//       </Box>

//       {/* Employee Header */}
//       <Box className="employee-header" display="flex" alignItems="center">
//         <Box position="relative">
//           <Avatar src={avthar} alt="Employee" sx={{ width: 64, height: 64 }} />
//           <img
//             src={online}
//             alt="Online"
//             style={{
//               position: "absolute",
//               bottom: 0,
//               right: 0,
//               width: 16,
//               height: 16,
//             }}
//           />
//         </Box>
//         <Grid container alignItems="center" ml={2}>
//           <Grid item xs={12} sm="auto" sx={{ px: 2 }}>
//             <Typography variant="body2" color="text.secondary">
//               Employee Name
//             </Typography>
//             <Typography fontWeight="bold">{employee?.name || "N/A"}</Typography>
//           </Grid>
//           <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
//           <Grid item xs={12} sm="auto" sx={{ px: 2 }}>
//             <Typography variant="body2" color="text.secondary">
//               Gen ID
//             </Typography>
//             <Typography fontWeight="bold">{employee?.genId || "N/A"}</Typography>
//           </Grid>
//           <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
//           <Grid item xs={12} sm="auto" sx={{ px: 2 }}>
//             <Typography variant="body2" color="text.secondary">
//               Designation
//             </Typography>
//             <Typography fontWeight="bold">
//               {employee?.designation || "N/A"}
//             </Typography>
//           </Grid>
//           <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
//           <Grid item xs={12} sm="auto" sx={{ px: 2 }}>
//             <Typography variant="body2" color="text.secondary">
//               Division
//             </Typography>
//             <Typography fontWeight="bold">
//               {employee?.division || "N/A"}
//             </Typography>
//           </Grid>
//           <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
//           <Grid item xs={12} sm="auto" sx={{ px: 2 }}>
//             <Typography variant="body2" color="text.secondary">
//               Manager
//             </Typography>
//             <Typography fontWeight="bold">
//               {employee?.manager || "N/A"}
//             </Typography>
//           </Grid>
//         </Grid>
//       </Box>

//       {/* Letter Details */}
//       <Box className="form-section" mt={3}>
//         <Typography variant="body1" fontWeight="bold" gutterBottom>
//           Letter Type: {letterType}
//         </Typography>
//         <Typography>Permanent Address: {permanentAddress}</Typography>
//         <Typography>Current Address: {currentAddress}</Typography>
//         <Typography>Reason: {reason}</Typography>
//         <Typography>Comment: {comment}</Typography>
//         {letterType === "No Objection Certificate" && (
//           <>
//             <Typography>Leave From: {nocFromDate}</Typography>
//             <Typography>Leave To: {nocToDate}</Typography>
//           </>
//         )}
//         {letterType === "Office Correspondence" && (
//           <Typography>Office Address: {officeAddress}</Typography>
//         )}
//       </Box>

//       {/* Approver Comment */}
//       <Box mt={3}>
//         <TextField
//           label="Approver Comment"
//           multiline
//           rows={3}
//           fullWidth
//           value={approverComment}
//           onChange={(e) => setApproverComment(e.target.value)}
//         />
//       </Box>

//       {/* Action Buttons */}
//       <Box display="flex" justifyContent="flex-end" mt={3}>
//         <Button
//           variant="contained"
//           color="success"
//           onClick={handleApprove}
//           sx={{ mr: 2 }}
//         >
//           Approve
//         </Button>
//         <Button variant="contained" color="error" onClick={handleReject}>
//           Reject
//         </Button>
//       </Box>
//     </Container>
//   );
// }
