// app/utils/dateHelpers.ts

// Always the same format: "Nov 19, 2025 at 11:53 AM"
export function formatAbsoluteDateTime(isoString: string): string {
    const date = new Date(isoString);
  
    const month = date.toLocaleString("en-US", { month: "short" }); // "Nov"
    const day = date.getDate();
    const year = date.getFullYear();
  
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // 0 -> 12, 13 -> 1, etc.
  
    return `${month} ${day}, ${year} at ${hours}:${minutes} ${ampm}`;
  }
  
  // We will call this ONLY on the client
  export function formatRelativeTime(isoString: string): string {
    const target = new Date(isoString).getTime();
    const now = Date.now();
    const diffMs = now - target;
  
    const seconds = Math.round(diffMs / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);
  
    if (seconds < 45) return "Just now";
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }
  