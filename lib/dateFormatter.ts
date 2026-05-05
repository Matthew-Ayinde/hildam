/**
 * Date formatting utility with GMT+1 timezone support
 * All dates are converted to GMT+1 (West Africa Time)
 */

const GMT_PLUS_ONE_OFFSET = 60; // GMT+1 is 60 minutes ahead of GMT

/**
 * Convert a date to GMT+1 timezone
 * @param date - The date to convert (string, number timestamp, or Date object)
 * @returns Date object adjusted to GMT+1
 */
export function convertToGMTPlus1(date: Date | string | number | null | undefined): Date | null {
  if (!date && date !== 0) return null;

  const dateObj = typeof date === "string" ? new Date(date) : typeof date === "number" ? new Date(date) : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return null;
  }

  // Get UTC date
  const utcDate = new Date(dateObj.toLocaleString("en-US", { timeZone: "UTC" }));
  
  // Adjust to GMT+1
  utcDate.setHours(utcDate.getHours() + 1);
  
  return utcDate;
}

/**
 * Format date with time in GMT+1 timezone (readable format)
 * Format: "22 May 2026, 10:05:00" 
 * @param date - The date to format
 * @returns Formatted date string or "N/A"
 */
export function formatDateTimeGMTPlus1(date: Date | string | number | null | undefined): string {
  const adjustedDate = convertToGMTPlus1(date);
  
  if (!adjustedDate) return "N/A";

  const days = adjustedDate.getDate();
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const month = monthNames[adjustedDate.getMonth()];
  const year = adjustedDate.getFullYear();
  const hours = String(adjustedDate.getHours()).padStart(2, "0");
  const minutes = String(adjustedDate.getMinutes()).padStart(2, "0");
  const seconds = String(adjustedDate.getSeconds()).padStart(2, "0");

  return `${days} ${month} ${year}, ${hours}:${minutes}:${seconds}`;
}

/**
 * Format date only (no time) in GMT+1 timezone
 * Format options:
 * - "full": "22 May 2026"
 * - "short": "22 May"
 * - "weekday": "Monday, 22 May 2026"
 * @param date - The date to format
 * @param format - "full" (22 May 2026), "short" (22 May), or "weekday" (Monday, 22 May 2026)
 * @returns Formatted date string or "N/A"
 */
export function formatDateGMTPlus1(
  date: Date | string | number | null | undefined,
  format: "full" | "short" | "weekday" = "short"
): string {
  const adjustedDate = convertToGMTPlus1(date);
  
  if (!adjustedDate) return "N/A";

  const days = adjustedDate.getDate();
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  const month = monthNames[adjustedDate.getMonth()];
  const year = adjustedDate.getFullYear();
  const weekday = weekdayNames[adjustedDate.getDay()];

  if (format === "full") {
    return `${days} ${month} ${year}`;
  }

  if (format === "weekday") {
    return `${weekday}, ${days} ${month} ${year}`;
  }

  // short format
  return `${days} ${month}`;
}

/**
 * Format time only in GMT+1 timezone
 * Format: "10:05:00" or "10:05"
 * @param date - The date to format
 * @param includeSeconds - Whether to include seconds
 * @returns Formatted time string or "N/A"
 */
export function formatTimeGMTPlus1(
  date: Date | string | number | null | undefined,
  includeSeconds: boolean = true
): string {
  const adjustedDate = convertToGMTPlus1(date);
  
  if (!adjustedDate) return "N/A";

  const hours = String(adjustedDate.getHours()).padStart(2, "0");
  const minutes = String(adjustedDate.getMinutes()).padStart(2, "0");
  
  if (includeSeconds) {
    const seconds = String(adjustedDate.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  return `${hours}:${minutes}`;
}

/**
 * Format date and time separately in GMT+1
 * @param date - The date to format
 * @returns Object with date and time strings
 */
export function formatDateTimeSeperately(
  date: Date | string | number | null | undefined
): { date: string; time: string } {
  return {
    date: formatDateGMTPlus1(date, "short"),
    time: formatTimeGMTPlus1(date, true),
  };
}

/**
 * Get current time in GMT+1
 * @returns Current date and time adjusted to GMT+1
 */
export function getCurrentTimeGMTPlus1(): Date {
  return convertToGMTPlus1(new Date()) || new Date();
}

/**
 * Compare two dates in GMT+1 (ignoring time)
 * @param date1 - First date
 * @param date2 - Second date
 * @returns true if dates are the same
 */
export function isSameDateGMTPlus1(
  date1: Date | string | number | null | undefined,
  date2: Date | string | number | null | undefined
): boolean {
  const d1 = convertToGMTPlus1(date1);
  const d2 = convertToGMTPlus1(date2);

  if (!d1 || !d2) return false;

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

/**
 * Check if a date is in the past (in GMT+1)
 * @param date - Date to check
 * @returns true if date is before today
 */
export function isPastDateGMTPlus1(date: Date | string | number | null | undefined): boolean {
  const checkDate = convertToGMTPlus1(date);
  if (!checkDate) return false;

  const today = getCurrentTimeGMTPlus1();
  today.setHours(0, 0, 0, 0);
  checkDate.setHours(0, 0, 0, 0);

  return checkDate < today;
}
