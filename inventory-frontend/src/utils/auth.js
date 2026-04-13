/**
 * Decodes the JWT payload from localStorage
 * Returns the decoded object, or null if invalid/missing
 */
export const getDecodedToken = () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) return null;

    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const parsedData = JSON.parse(jsonPayload);
    
    // Check if token is expired
    if (parsedData.exp && parsedData.exp * 1000 < Date.now()) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      return null;
    }

    return parsedData;
  } catch (err) {
    console.error("Failed to decode token", err);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return null;
  }
};

/**
 * Convenience method to get just the role
 */
export const getUserRole = () => {
  const tokenData = getDecodedToken();
  return tokenData ? tokenData.role : null;
};
