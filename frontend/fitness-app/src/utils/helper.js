export const validateEmail = (email) => {
  // Regular expression to validate email
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getProfileImageUrl = (profileImageUrl) => {
  const isAbsoluteUrl = (url) => /^https?:\/\//i.test(url);

  if (!profileImageUrl) {
    return "src/assets/profile1.png";
  }

  return isAbsoluteUrl(profileImageUrl)
    ? profileImageUrl
    : `${BASE_URL}/${profileImageUrl}`;
};

export const logout = () => {
  localStorage.removeItem("token");
  window.dispatchEvent(new Event("logout"));
  window.location.href = "/login";
}