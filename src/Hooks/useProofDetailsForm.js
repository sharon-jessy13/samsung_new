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
    if (!mempId) {
      alert("Please enter your Employee ID");
      return;
    }

    setIsCheckingAccess(true);
    try {
      console.log(`🔍 Checking access for Employee ID: ${mempId}`);
      
      // Call API to check if employee has access
      const resourceType = await getEmpResourceType(mempId);
      console.log("Resource Type:", resourceType);
      
      if (resourceType !== null && resourceType !== undefined) {
        setHasAccess(true);
        setAccessChecked(true);
        alert("✅ Access granted! You can now fill out the HR letter request form.");
        
        // Fetch letter types after access is granted
        const letterTypesData = await getLetterTypes();
        setLetterTypes(letterTypesData);
      } else {
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
    try {
      // Validate required fields
      if (!mempId) {
        alert("Please enter your Employee ID");
        return;
      }
      
      if (!letterType) {
        alert("Please select a letter type");
        return;
      }
      
      if (!letterTypeKey) {
        alert("Letter type key is missing. Please select a valid letter type.");
        return;
      }

      const generatedInstanceId = Math.floor(Math.random() * 90000000) + 10000000; // Generate random 8-digit number 
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
      
      // Additional success handling if API returns specific status
      if (response && response.status) {
        console.log("HR Letter details updated successfully in backend");
      }
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
    }
  };

  return {
    letterTypes,
    letterType,
    setLetterType,
    addressType,
    setAddressType,
    reason,
    setReason,
    comment,
    setComment,
    instanceId,
    setInstanceId,
    mempId,
    setMempId,
    hasAccess,
    isCheckingAccess,
    accessChecked,
    handleCheckAccess,
    handleSubmit,
    handleLetterTypeChange
  };
}
