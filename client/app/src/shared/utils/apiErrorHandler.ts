type ErrorAction = {
  message: string;
  showRetry: boolean;
  showSupport: boolean;
  logout: boolean;
};

export const handleApiError = (error: any): ErrorAction => {
  // Default fallback
  const result: ErrorAction = {
    message: "Something went wrong. Please try again.",
    showRetry: true,
    showSupport: false,
    logout: false,
  };

  if (!error || !("status" in error)) {
    result.message = "Network error. Please check your internet connection.";
    result.showRetry = true;
    return result;
  }

  switch (error.status) {
    case 401:
      return {
        message: "Your session has expired. Please login again.",
        showRetry: false,
        showSupport: false,
        logout: true,
      };

    case 403:
      return {
        message: "You don’t have permission to access this data.",
        showRetry: false,
        showSupport: false,
        logout: false,
      };

    case 404:
      return {
        message: "Requested data was not found.",
        showRetry: true,
        showSupport: false,
        logout: false,
      };

    case 500:
      return {
        message: "Server is down. Please contact support.",
        showRetry: false,
        showSupport: true,
        logout: false,
      };

    case "FETCH_ERROR":
      return {
        message: "No internet connection. Please check your network.",
        showRetry: true,
        showSupport: false,
        logout: false,
      };

    case "TIMEOUT_ERROR":
      return {
        message: "Request timed out. Please try again.",
        showRetry: true,
        showSupport: false,
        logout: false,
      };

    default:
      return result;
  }
};
