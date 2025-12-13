export async function apiCall(endpoint, method, data) {
  const API_URL = "http://localhost:1550"; 

  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API error: ${error}`);
    throw error;
  }
}
