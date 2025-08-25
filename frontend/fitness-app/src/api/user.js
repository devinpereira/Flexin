import { BASE_URL, API_PATHS } from '../utils/apiPaths';

export async function getUserInfo() {
  const res = await fetch(`${BASE_URL}${API_PATHS.AUTH.GET_USER_INFO}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error('Failed to fetch user info');
  const data = await res.json();
  return data.user || data;
}
