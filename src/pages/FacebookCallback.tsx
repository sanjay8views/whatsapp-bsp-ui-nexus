
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FacebookCallback = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Extract the authorization code and state from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    const error = urlParams.get("error");
    const errorReason = urlParams.get("error_reason");
    const errorDescription = urlParams.get("error_description");
    
    // Send the code back to the parent window
    if (window.opener) {
      if (error) {
        window.opener.postMessage({ 
          error, 
          errorReason, 
          errorDescription 
        }, window.location.origin);
      } else if (code && state) {
        // Send the code and state back to the parent window
        window.opener.postMessage({ code, state }, window.location.origin);
      }
      
      // Close this popup window after a short delay
      setTimeout(() => {
        window.close();
      }, 1000);
    } else {
      // If opened directly (not as popup), redirect back to dashboard
      navigate("/");
    }
  }, [navigate]);
  
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-lg font-medium">Completing Facebook connection...</p>
        <p className="text-sm text-gray-500 mt-2">This window will close automatically</p>
      </div>
    </div>
  );
};

export default FacebookCallback;
