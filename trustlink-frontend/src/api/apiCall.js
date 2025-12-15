export async function apiCall(endpoint, method, data) {
  const API_URL = "http://localhost:1550"; 

  try {
    console.log('Making API call:', { endpoint, method, data });
    
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', 
      body: data ? JSON.stringify(data) : undefined,
    });

    const responseData = await response.json();
    console.log('Response:', responseData);

    if (!response.ok) {
      throw new Error(responseData.message || `API error: ${response.status}`);
    }

    return responseData;
  } catch (error) {
    console.error(`API error:`, error);
    throw error;
  }
}