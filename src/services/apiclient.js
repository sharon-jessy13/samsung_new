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
      return result.data; // return only the resource type (e.g., 1)
    } else {
      throw new Error(result.message || "Unknown error from server");
    }
  } catch (error) {
    console.error("Failed to fetch employee resource type:", error);
    throw error;
  }
}

export async function updateHRLetterDetails(data) {
  const response = await fetch('http://107.108.5.184:66/api/HRLetter/UpdateDetails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update HR letter details');
  }

  return await response.json();
}

export async function getHRLetterDetailsByInstanceID(instanceId) {
  try {
    const response = await fetch(`${baseURL}/api/HRLetter/GetHRLetterDetailsByInstanceID?InstanceID=${instanceId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching instance details:', error);
    return null;
  }
}