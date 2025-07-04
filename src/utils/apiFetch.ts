export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');

  const headers = new Headers(options.headers || {});
  
  // Always include these headers
 if (options.method !== 'GET') {
  headers.set('Content-Type', 'application/json');
}
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`http://localhost:8080${endpoint}`, {
    ...options,
    headers,
     credentials: 'include',
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/';
    throw new Error('Unauthorized');
  }

  return response;
}