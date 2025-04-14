
import { format, parseISO } from "date-fns";

/**
 * Formats a timestamp string to display time in HH:mm format
 * This function does not perform any timezone conversion
 * @param timestamp ISO format timestamp string
 * @returns Formatted time string in HH:mm format
 */
export const formatMessageTime = (timestamp: string): string => {
  try {
    if (!timestamp) return "";
    
    console.log("Original timestamp from API:", timestamp);
    const date = parseISO(timestamp);
    console.log("Parsed date object:", date);
    console.log("Browser timezone:", Intl.DateTimeFormat().resolvedOptions().timeZone);
    
    // Use UTC methods to extract hours and minutes without timezone conversion
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    
    const timeString = `${hours}:${minutes}`;
    console.log("Formatted time (UTC):", timeString);
    
    return timeString;
  } catch (error) {
    console.error("Error formatting timestamp:", error, timestamp);
    return "Invalid date";
  }
};
