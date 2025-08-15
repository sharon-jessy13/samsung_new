const baseURL = 'http://107.108.5.184:66';

export async function getLetterTypes() {
  try {
    const response = await fetch(`${baseURL}/api/HRLetter/GetletterTypes`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    const result = await response.json();
    console.log(" result:", result);
    return result.data; // ✅ Return only the array
  } catch (error) {
    console.error("❌ Failed to load  letter types:", error);
    return [];
  }
}
export async function getEmpResourceType(MEmpID) {
  try {
    const response = await fetch(`${baseURL}/api/HRLetter/GetEmpResourceType?MEmpID=${MEmpID}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Full API Response:", result);

    if (result.status) {
      return result.data; // return only the resource type (e.g., 1 or 0)
    } else {
      throw new Error(result.message || "Unknown error from server");
    }
  } catch (error) {
    console.error("Failed to fetch employee resource type:", error);
    throw error;
  }
}

export async function updateHRLetterDetails(data) {
  try {
    console.log(" Sending payload to API:", data);
    
    const response = await fetch(`${baseURL}/api/HRLetter/UpdateDetails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log(" API Response:", result);

    if (!response.ok) {
      // Extract detailed error information from the response
      const errorMessage = result.message || result.error || `HTTP ${response.status}: ${response.statusText}`;
      const validationErrors = result.errors || result.details || '';
      
      throw new Error(`${errorMessage}${validationErrors ? ` - ${JSON.stringify(validationErrors)}` : ''}`);
    }

    // Check if API returns status: false (business logic failure)
    if (result && result.status === false) {
      console.error(" API returned status: false");
      console.error(" Error message:", result.message || 'No error message provided');
      console.error(" Error details:", result.errors || result.details || 'No error details provided');
      
      // Check if instance ID is available even with status: false
      if (result.data && result.data.instanceID) {
        console.log("📋 Instance ID available despite status: false -", result.data.instanceID);
      } else if (result.instanceID) {
        console.log("📋 Instance ID available despite status: false -", result.instanceID);
      }
      
      // Create error with instance ID included if available
      const errorMsg = result.message || 'API request failed';
      const errorDetails = result.errors || result.details || '';
      const instanceId = result.data?.instanceID || result.instanceID || null;
      
      const error = new Error(`${errorMsg}${errorDetails ? ` - ${JSON.stringify(errorDetails)}` : ''}`);
      error.instanceId = instanceId; // Attach instance ID to error object
      error.apiResponse = result; // Attach full response for debugging
      
      throw error;
    }

    return result;
  } catch (error) {
    console.error(" API Error:", error);
    throw error;
  }
}

export async function getHRLetterDetailsByInstanceID(instanceId) {
  const res = await fetch(
    `${baseURL}/api/HRLetter/GetHRLetterDetailsByInstanceID?InstanceID=${instanceId}`
  );
  const json = await res.json();
  if (json.status && json.data) {
    return json.data; 
  } else {
    throw new Error(json.message || "Failed to fetch letter details");
  }
}