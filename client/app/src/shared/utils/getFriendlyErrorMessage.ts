export const getFriendlyErrorMessage = (error: any) => {
  if (!error) return "Something went wrong. Please try again.";

  if ("status" in error) {
    switch (error.status) {
      case 400:
        return "Invalid request. Please try again.";

      case 401:
        return "Your session has expired. Please login again.";

      case 403:
        return "You don’t have permission to access this data.";

      case 404:
        return "Requested data was not found.";

      case 500:
        return "Server is currently unavailable. Please try later.";

      case "FETCH_ERROR":
        return "No internet connection. Please check your network.";

      case "TIMEOUT_ERROR":
        return "Request timed out. Please try again.";

      default:
        return "Unexpected error occurred. Please try again.";
    }
  }

  return "Network error. Please check your connection.";
};
