import { getBrowserInfo, getOperatingSystem } from "./utils/stack";

class BugReporter {
  constructor(apiEndpoint) {
    this.apiEndpoint = apiEndpoint;
    this.networkRequestDetails = []; // Store captured network details
    // Capture fetch function to intercept network requests
    this.originalFetch = window.fetch;
  }

  reportUIBug(errorData) {
    // Include captured network details in the bug report
    errorData.networkRequests = this.networkRequestDetails;
    console.log("errorData", errorData);
    fetch(this.apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: errorData }),
    })
      .then((response) => response.json())
      .then((data) => console.log("UI bug report sent:", data))
      .catch((err) => console.error("Error sending UI bug report:", err));
  }

  setupErrorListener() {
    const handleUIError = (errorEvent) => {
      console.log("errorEvent", errorEvent);
      // Report the UI-related error to the server using the BugReporter
      const errorData = {
        errorMessage: errorEvent.error.message,
        stackTrace: errorEvent.error.stack,
        file: errorEvent.filename,
        lineNumber: errorEvent.lineno,
        columnNumber: errorEvent.colno,
        userAgent: navigator.userAgent,
        browser: getBrowserInfo(),
        operatingSystem: getOperatingSystem(),
        // Add more properties as needed
      };

      this.reportUIBug(errorData);
      this.setupFetchInterceptor();
    };

    // Attach the error event listener
    window.addEventListener("error", handleUIError);

    // Return a function to clean up the event listener on component unmount
    return () => {
      window.removeEventListener("error", handleUIError);
    };
  }

  setupFetchInterceptor() {
    // Intercept fetch requests to capture network details
    window.fetch = async (url, options) => {
      try {
        const response = await this.originalFetch(url, options);

        // Log or capture network details as needed
        console.log("Network Request:", {
          url,
          method: options.method || "GET",
          status: response.status,
          statusText: response.statusText,
        });
        if (url !== this.apiEndpoint) {
          this.networkRequestDetails.push(networkRequest);
        }

        return response;
      } catch (error) {
        console.error("Network Request Error:", { url, error });
        throw error;
      }
    };
  }
}

export default BugReporter;
