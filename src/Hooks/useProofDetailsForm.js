import { useState, useEffect } from "react";
import {
  getLetterTypes,
  getEmpResourceType,
  getHRLetterDetailsByInstanceID,
  updateHRLetterDetails
} from "../services/apiclient";

export default function useProofDetailsForm(initialData) {
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
  const [numberOfCopies, setNumberOfCopies] = useState(1); // Optional
  const [officeAddress, setOfficeAddress] = useState('');
  const [placeOfTravel, setPlaceOfTravel] = useState('');
  const [letterTypeKey, setLetterTypeKey] = useState('');
  const [letterTypes, setLetterTypes] = useState([]);
  const [mempId, setMempId] = useState(''); // Employee ID to be entered by user
  const [hasAccess, setHasAccess] = useState(false); // Access permission status
  const [isCheckingAccess, setIsCheckingAccess] = useState(false); // Loading state for access check
  const [accessChecked, setAccessChecked] = useState(false); // Whether access check has been performed
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


  // Check employee access permission
  const handleCheckAccess = async () => {
    if (!mempId || mempId === '0' || parseInt(mempId, 10) === 0) {
      alert("Please enter a valid Employee ID (non-zero)");
      return;
    }

    setIsCheckingAccess(true);
    try {
      console.log(`🔍 Checking access for Employee ID: ${mempId}`);
      
      // Call API to check if employee has access
      const resourceType = await getEmpResourceType(parseInt(mempId, 10));
      console.log("Resource Type:", resourceType);

      // Only allow access when API explicitly returns 1
      if (resourceType === 1) {
        setHasAccess(true);
        setAccessChecked(true);
        alert("✅ Access granted! You can now fill out the HR letter request form.");

        // Fetch letter types after access is granted
        const letterTypesData = await getLetterTypes();
        setLetterTypes(letterTypesData);
      } else {
        // Covers 0, null, undefined, or any non-1 value
        setHasAccess(false);
        setAccessChecked(true);
        alert("❌ Access denied. You are not authorized to submit HR letter requests.");
      }
    } catch (error) {
      console.error("Error checking access:", error);
      setHasAccess(false);
      setAccessChecked(true);
      alert("❌ Error checking access. Please verify your Employee ID and try again.");
    } finally {
      setIsCheckingAccess(false);
    }
  };

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
      
      const generatedInstanceId = Math.floor(Math.random() * 90000000) + 10000000; // Generate random 8-digit number 
      // Persist generated ID immediately so UI can show something even before API responds
      setInstanceId(generatedInstanceId);
      const payload = {
        lrid: 0,
        instanceID: generatedInstanceId,
        MempId: parseInt(mempId),
        lKeyValue: letterTypeKey || letterType, // Fallback to letterType if key is missing
        letterType: letterType,
        permanentAddress: permanentAddress || "",
        currentAddress: currentAddress || "",
        ltrReqOnCuOrPeAdd: addressType || "",
        reason: reason || "",
        numberOfCopies: numberOfCopies || 1,
        offAddOfCorrespondance: officeAddress || "",
        placeOfTravel: placeOfTravel || "",
        noc_LeaveFrom: nocFromDate || null,
        noc_LeaveTo: nocToDate || null
      };
      console.log("Submitting payload:", payload);

      const response = await updateHRLetterDetails(payload);
      console.log("API Response:", response);
      
      // Show success message regardless of API response structure
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
    numberOfCopies,
    setNumberOfCopies,
    officeAddress,
    setOfficeAddress,
    placeOfTravel,
    setPlaceOfTravel,
    instanceId,
    setInstanceId,
    mempId,
    setMempId,
    hasAccess,
    isCheckingAccess,
    accessChecked,
    handleCheckAccess,
    isSubmitting,
    handleSubmit,
    handleLetterTypeChange
  };
}
