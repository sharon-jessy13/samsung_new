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

export async function updateHRLetterApproval(data) {
  try {
    console.log("Sending approval payload:", data);

    const response = await fetch(`${baseURL}/api/HRLetter/UpdateDetails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("Approval API Response:", result);

    if (!response.ok) {
      throw new Error(result.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    if (result && result.status === false) {
      throw new Error(result.message || "Approval request failed");
    }

    return result;
  } catch (error) {
    console.error("Approval API Error:", error);
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