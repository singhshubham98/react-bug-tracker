import { getBrowserInfo, getOperatingSystem } from "./utils/stack";

class BugReporter {
  constructor(apiEndpoint) {
    this.apiEndpoint = apiEndpoint;
  }

  reportUIBug(errorData) {
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
      // Report the UI-related error to the server using the BugReporter
      console.log("errorEvent", errorEvent);
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
    };

    // Attach the error event listener
    window.addEventListener("error", handleUIError);

    // Return a function to clean up the event listener on component unmount
    return () => {
      window.removeEventListener("error", handleUIError);
    };
  }
}

export default BugReporter;
