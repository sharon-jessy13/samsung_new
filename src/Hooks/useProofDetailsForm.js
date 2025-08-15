// import { useState, useEffect } from "react";
// import {
//   getLetterTypes,
//   getHRLetterDetailsByInstanceID,
//   updateHRLetterDetails
// } from "../services/apiclient";

// export default function useProofDetailsForm(initialData = {}) {
//   const [instanceId, setInstanceId] = useState(initialData.instanceId || "");
//   const [letterType, setLetterType] = useState('');
//   const [letterTypes, setLetterTypes] = useState([]);
//   const [letterTypeKey, setLetterTypeKey] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Unused form states can be removed later if not needed
//   const [reason, setReason] = useState('');
//   const [comment, setComment] = useState('');
//   const [nocFromDate, setNocFromDate] = useState('');
//   const [nocToDate, setNocToDate] = useState('');
//   const [permanentAddress, setPermanentAddress] = useState('');
//   const [currentAddress, setCurrentAddress] = useState('');
//   const [addressType, setAddressType] = useState('');
//   const [officeAddress, setOfficeAddress] = useState('');
//   const [mempId, setMempId] = useState('');

//   // Static payload for submission
//   const STATIC_PAYLOAD = {
//     lrid: 0,
//     // instanceID will be injected at submit time
//     MempId: 16843,
//     lKeyValue: "NOC",
//     letterType: "No Objection Certificate",
//     permanentAddress: "123, Main Street, Hyderabad",
//     currentAddress: "456, Residency Road, Bangalore",
//     ltrReqOnCuOrPeAdd: "Current",
//     reason: "For official travel purposes",
//     offAddOfCorrespondance: "Samsung Office, Bangalore",
//     noc_LeaveFrom: "2025-08-15",
//     noc_LeaveTo: "2025-08-20"
//   };

//   // Fetch letter types
//   useEffect(() => {
//     async function fetchLetterTypes() {
//       try {
//         const data = await getLetterTypes();
//         setLetterTypes(data);
//       } catch (error) {
//         console.error("Error fetching letter types:", error);
//       }
//     }
//     fetchLetterTypes();
//   }, []);

//   const handleLetterTypeChange = (e) => {
//     const selectedType = e.target.value;
//     setLetterType(selectedType);

//     const selectedLetterType = letterTypes.find(type => type.letterType === selectedType);
//     if (selectedLetterType) {
//       setLetterTypeKey(selectedLetterType.lKeyValue || selectedLetterType.key || selectedType);
//     }
//   };

//   // Always submit static payload
// const handleSubmit = async () => {
//   if (isSubmitting) return;

//   try {
//     setIsSubmitting(true);

//     const generatedInstanceId = Math.floor(Math.random() * 90000000) + 10000000;
//     setInstanceId(generatedInstanceId);

//     const payload = {
//       lrid: 0,
//       instanceID: generatedInstanceId,
//       MempId: mempId || 16843, 
//       lKeyValue: letterTypeKey,
//       letterType: letterType,
//       permanentAddress,
//       currentAddress,
//       ltrReqOnCuOrPeAdd: addressType,
//       reason,
//       offAddOfCorrespondance: officeAddress,
//       noc_LeaveFrom: nocFromDate,
//       noc_LeaveTo: nocToDate,
//       comment,
//     };

//     console.log("📤 Submitting dynamic payload:", payload);

//     const response = await updateHRLetterDetails(payload);
//     console.log("✅ API Response:", response);
//     alert("Form submitted successfully with dynamic data!");

//     // Prefer instanceID from API if returned
//     const finalId = response?.data?.instanceID || response?.instanceID || generatedInstanceId;
//     setInstanceId(finalId);

//     // Optional verification fetch
//     try {
//       const verify = await getHRLetterDetailsByInstanceID(finalId);
//       console.log("🔍 Verification after POST:", verify);
//     } catch (verifyErr) {
//       console.error("❌ Verification failed:", verifyErr);
//     }
//   } catch (error) {
//     console.error("❌ Error submitting form:", error);
//     alert(`Error: ${error.message || 'Unknown error occurred'}`);
//   } finally {
//     setIsSubmitting(false);
//   }
// };


//   return {
//     letterTypes,
//     letterType,
//     setLetterType,
//     letterTypeKey,
//     setLetterTypeKey,
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
//     instanceId,
//     setInstanceId,
//     mempId,
//     setMempId,
//     isSubmitting,
//     handleSubmit,
//     handleLetterTypeChange
//   };
// }


import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getLetterTypes,
  getHRLetterDetailsByInstanceID,
  updateHRLetterApproval
} from "../services/apiclient";

export default function useProofDetailsForm(initialData = {}) {
  // Get instanceId from URL params and strip any leading colon
  const { instanceId: routeInstanceId } = useParams();
  const cleanInstanceId =
    routeInstanceId?.replace(/^:/, "") || initialData.instanceId || "";

  const [instanceId, setInstanceId] = useState(cleanInstanceId);
  const [letterType, setLetterType] = useState("");
  const [letterTypes, setLetterTypes] = useState([]);
  const [letterTypeKey, setLetterTypeKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [nocFromDate, setNocFromDate] = useState("");
  const [nocToDate, setNocToDate] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [addressType, setAddressType] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");
  const [mempId, setMempId] = useState("");

  // Fetch letter types on mount
  useEffect(() => {
    async function fetchLetterTypes() {
      try {
        const data = await getLetterTypes();
        setLetterTypes(data);
      } catch (error) {
        console.error("❌ Error fetching letter types:", error);
      }
    }
    fetchLetterTypes();
  }, []);

  // Fetch existing letter details if instanceId exists
  useEffect(() => {
    if (!instanceId) return;

    async function fetchLetterDetails() {
      try {
        const details = await getHRLetterDetailsByInstanceID(instanceId);
        if (details) {
          console.log("📥 Loaded existing letter details:", details);

          setLetterType(details.letterType || "");
          setLetterTypeKey(details.lKeyValue || "");
          setReason(details.reason || "");
          setComment(details.comment || "");
          setNocFromDate(details.noc_LeaveFrom || "");
          setNocToDate(details.noc_LeaveTo || "");
          setPermanentAddress(details.permanentAddress || "");
          setCurrentAddress(details.currentAddress || "");
          setAddressType(details.ltrReqOnCuOrPeAdd || "");
          setOfficeAddress(details.offAddOfCorrespondance || "");
          setMempId(details.MempId || "");
        }
      } catch (error) {
        console.error("❌ Error fetching letter details:", error);
      }
    }

    fetchLetterDetails();
  }, [instanceId]);

  // Letter type change handler
  const handleLetterTypeChange = (e) => {
    const selectedType = e.target.value;
    setLetterType(selectedType);

    const selectedLetterType = letterTypes.find(
      (type) => type.letterType === selectedType
    );
    if (selectedLetterType) {
      setLetterTypeKey(
        selectedLetterType.lKeyValue || selectedLetterType.key || selectedType
      );
    }
  };

  // Submit handler
  const handleSubmit = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const generatedInstanceId =
        instanceId || Math.floor(Math.random() * 90000000) + 10000000;
      setInstanceId(generatedInstanceId);

      const payload = {
        lrid: 0,
        instanceID: generatedInstanceId,
        MempId: mempId || 16843,
        lKeyValue: letterTypeKey,
        letterType,
        permanentAddress,
        currentAddress,
        ltrReqOnCuOrPeAdd: addressType,
        reason,
        offAddOfCorrespondance: officeAddress,
        placeOfTravel: " ",
        numberOfCopies: 1,
        noc_LeaveFrom: nocFromDate,
        noc_LeaveTo: nocToDate,
        comment
      };

      console.log("📤 Submitting payload:", payload);

      const response = await updateHRLetterApproval(payload);
      console.log("✅ API Response:", response);
      alert("Form submitted successfully!");

      // Use instanceID from API if returned
      const finalId =
        response?.data?.instanceID || response?.instanceID || generatedInstanceId;
      setInstanceId(finalId);

      // Optional: verify saved data
      try {
        const verify = await getHRLetterDetailsByInstanceID(finalId);
        console.log("🔍 Verification after POST:", verify);
      } catch (verifyErr) {
        console.error("❌ Verification failed:", verifyErr);
      }
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      alert(`Error: ${error.message || "Unknown error occurred"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    letterTypes,
    letterType,
    setLetterType,
    letterTypeKey,
    setLetterTypeKey,
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
    instanceId,
    setInstanceId,
    mempId,
    setMempId,
    isSubmitting,
    handleSubmit,
    handleLetterTypeChange
  };
}