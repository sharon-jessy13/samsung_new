import { useState, useEffect } from "react";
import {
  getLetterTypes,
  getEmpResourceType,
  getHRLetterDetailsByInstanceID,
  updateHRLetterDetails
} from "../services/apiclient";

export default function useProofDetailsForm(initialData) {
  const [instanceId, setInstanceId] = useState(initialData.instanceId || "");
  
  // const [reason, setReason] = useState(initialData.reason || "");
  // const [address, setAddress] = useState(initialData.address || "");
  // const [comment, setComment] = useState(initialData.comment || "");
  // const [letterType, setLetterType] = useState(initialData.letterType || "");
  
  // const [addressType, setAddressType] = useState(''); // For "ltrReqOnCurOrPerAdd"
  // const [numberOfCopies, setNumberOfCopies] = useState(1); // Optional
  // const [officeAddress, setOfficeAddress] = useState('');
  // const [placeOfTravel, setPlaceOfTravel] = useState('');
  // const [letterTypeKey, setLetterTypeKey] = useState('');
  // const [letterTypes, setLetterTypes] = useState([]);
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
    setLetterType(e.target.value);
    setIsSubmitted(false);
    setReason('');
    setComment('');
    
  };

  // Submit form
  const handleSubmit = async () => {
    try {
      const generatedInstanceId = 10570820; 
      const payload = {
        lrid: 0,
        instanceID: generatedInstanceId, // Auto-generate on submit
        MempId: 16843,                   // Employee ID
        lKeyValue: letterTypeKey,         // Could be generated or fetched
        letterType: letterType,
        permanentAddress: permanentAddress,
        currentAddress: currentAddress,
        ltrReqOnCuOrPeAdd: addressType,
        reason: reason,
        numberOfCopies: 1,
        offAddOfCorrespondance: officeAddress,
        placeOfTravel: placeOfTravel,
        noc_LeaveFrom: nocFromDate,
        noc_LeaveTo: nocToDate
      };
      console.log("Submitting payload:", payload);

      const response = await updateHRLetterDetails(payload);
      console.log("API Response:", response);
    } catch (error) {
      console.error("Error submitting form:", error);
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
    handleSubmit,
    handleLetterTypeChange
  };
}
