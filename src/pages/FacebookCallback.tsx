
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FacebookCallback = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Extract the authorization code from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    const error = urlParams.get("error");
    
    if (error) {
      console.error("Facebook authentication error:", error);
      // Send error message to the parent window
      window.opener.postMessage({ error }, window.opener.location.origin);
      window.close();
      return;
    }
    
    if (code && state) {
      // Send the code back to the parent window
      window.opener.postMessage({ code, state }, window.opener.location.origin);
      // Close this popup window
      window.close();
    } else {
      // If there's no code, redirect back to the dashboard
      navigate("/");
    }
  }, [navigate]);
  
  return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-center">Completing Facebook connection...</p>
    </div>
  );
};

export default FacebookCallback;
