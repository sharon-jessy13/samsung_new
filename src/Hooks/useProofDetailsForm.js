import { useState, useEffect } from "react";
import {
  getLetterTypes,
  getHRLetterDetailsByInstanceID,
  updateHRLetterDetails
} from "../services/apiclient";

export default function useProofDetailsForm(initialData) {
  // Toggle to force static payload submission regardless of form inputs
  const USE_STATIC_SUBMIT = true;
  const STATIC_PAYLOAD_BASE = {
    lrid: 0,
    // instanceID will be injected at submit time
    MempId: 16843,
    lKeyValue: "NOC",
    letterType: "No Objection Certificate",
    permanentAddress: "123, Main Street, Hyderabad",
    currentAddress: "456, Residency Road, Bangalore",
    ltrReqOnCuOrPeAdd: "Current",
    reason: "For official travel purposes",
    offAddOfCorrespondance: "Samsung Office, Bangalore",
    noc_LeaveFrom: "2025-08-15",
    noc_LeaveTo: "2025-08-20"
  };

  const [instanceId, setInstanceId] = useState(initialData.instanceId || "");

  const [letterType, setLetterType] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');
  const [nocFromDate, setNocFromDate] = useState('');
  const [nocToDate, setNocToDate] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');
  const [addressType, setAddressType] = useState(''); // For "ltrReqOnCurOrPerAdd"
  const [officeAddress, setOfficeAddress] = useState('');
  const [letterTypeKey, setLetterTypeKey] = useState('');
  const [letterTypes, setLetterTypes] = useState([]);
  const [mempId, setMempId] = useState(''); // Employee ID to be entered by user
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevent multiple submissions


  // Fetch letter types
  useEffect(() => {
    async function fetchLetterTypes() {
      try {
        const data = await getLetterTypes();
        setLetterTypes(data);
      } catch (error) {
        console.error("Error fetching letter types:", error);
      }
    }
    fetchLetterTypes();
  }, []);


  const handleLetterTypeChange = (e) => {
    const selectedType = e.target.value;
    setLetterType(selectedType);
    setIsSubmitted(false);
    setReason('');
    setComment('');

    // Find the selected letter type and set the key
    const selectedLetterType = letterTypes.find(type => type.letterType === selectedType);
    if (selectedLetterType) {
      setLetterTypeKey(selectedLetterType.lKeyValue || selectedLetterType.key || selectedType);
    }
  };

  // Submit form
  const handleSubmit = async () => {
    // Prevent multiple submissions
    if (isSubmitting) {
      console.log("⚠️ Form is already being submitted, ignoring duplicate submission");
      return;
    }

    try {
      // If static submit is enabled, bypass form validations and post static payload
      if (USE_STATIC_SUBMIT) {
        setIsSubmitting(true);
        const generatedInstanceId = Math.floor(Math.random() * 90000000) + 10000000;
        setInstanceId(generatedInstanceId);

        const payload = { ...STATIC_PAYLOAD_BASE, instanceID: generatedInstanceId };
        console.log("Submitting STATIC payload:", payload);

        const response = await updateHRLetterDetails(payload);
        console.log("API Response (static submit):", response);

        alert("✅ Form submitted successfully with static data!");
        setIsSubmitted(true);

        const responseInstanceId = response && (response.data?.instanceID || response.instanceID);
        const finalId = responseInstanceId || generatedInstanceId;
        if (responseInstanceId) {
          console.log("📋 Instance ID from API response:", responseInstanceId);
        } else {
          console.log("ℹ️ Using locally generated Instance ID (no ID returned by API):", finalId);
        }
        setInstanceId(finalId);

        // Optional verification fetch
        try {
          const verify = await getHRLetterDetailsByInstanceID(finalId);
          console.log("🔎 Verify after POST (static):", verify);
          if (!verify || verify.status === false || verify.data == null) {
            console.warn("⚠️ Verification: No details found for Instance ID:", finalId);
          }
        } catch (verifyErr) {
          console.error("❌ Verification GET failed (static):", verifyErr);
        }

        return finalId;
      }

      // Validate required fields BEFORE locking submit state
      if (!mempId || mempId === '0' || parseInt(mempId, 10) === 0) {
        alert("Please enter a valid Employee ID (non-zero)");
        return null;
      }
      if (!letterType) {
        alert("Please select a letter type");
        return null;
      }
      if (!letterTypeKey) {
        alert("Letter type key is missing. Please select a valid letter type.");
        return null;
      }

      setIsSubmitting(true);

      const generatedInstanceId = Math.floor(Math.random() * 90000000) + 10000000;
      setInstanceId(generatedInstanceId);

      const payload = {
        lrid: 0,
        instanceID: generatedInstanceId,
        MempId: 16843,  
        lKeyValue: "NOC", 
        letterType: "No Objection Certificate", 
        permanentAddress: "123, Main Street, Hyderabad", 
        currentAddress: "456, Residency Road, Bangalore", 
        ltrReqOnCuOrPeAdd: "Current", 
        reason: "For official travel purposes", 
        offAddOfCorrespondance: "Samsung Office, Bangalore", 
        noc_LeaveFrom: "2025-08-15", 
        noc_LeaveTo: "2025-08-20" 
      };

      console.log("Submitting static payload:", payload);

      const response = await updateHRLetterDetails(payload);
      console.log("API Response:", response);

      alert("✅ Form submitted successfully!");

      setIsSubmitted(true);

      // Determine final instance ID (prefer server-confirmed ID)
      const responseInstanceId = response && (response.data?.instanceID || response.instanceID);
      const finalId = responseInstanceId || generatedInstanceId;
      if (responseInstanceId) {
        console.log("📋 Instance ID from API response:", responseInstanceId);
      } else {
        console.log("ℹ️ Using locally generated Instance ID (no ID returned by API):", finalId);
      }
      setInstanceId(finalId);

      // Additional success handling if API returns specific status
      if (response && response.status) {
        console.log("HR Letter details updated successfully in backend");
      } else if (response && response.status === false) {
        console.log("⚠️ API returned status: false, but form was submitted");
      }

      // Immediately verify by fetching details with the final instance ID
      try {
        const verify = await getHRLetterDetailsByInstanceID(finalId);
        console.log("🔎 Verify after POST:", verify);
        if (!verify || verify.status === false || verify.data == null) {
          console.warn("⚠️ Verification: No details found for Instance ID:", finalId);
        }
      } catch (verifyErr) {
        console.error("❌ Verification GET failed:", verifyErr);
      }

      // Return the final ID to caller (for navigation or display)
      return finalId;
    } catch (error) {
      console.error("Error submitting form:", error);

      // More specific error handling
      if (error.message.includes('400')) {
        alert("❌ Bad Request: Please check all required fields are filled correctly.");
      } else if (error.message.includes('500')) {
        alert("❌ Server Error: Please try again later or contact support.");
      } else {
        alert(`❌ Error: ${error.message || 'Unknown error occurred'}`);
      }

    } finally {
      setIsSubmitting(false); // Reset submission state
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
