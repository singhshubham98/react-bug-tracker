import { getBrowserInfo, getOperatingSystem } from "./utils/stack";
import html2canvas from "html2canvas";

class BugReporter {
  constructor(apiEndpoint) {
    this.apiEndpoint = apiEndpoint;
  }

  async captureScreenshot() {
    try {
      // Use html2canvas to capture the entire HTML content
      const canvas = await html2canvas(document.body);

      // Convert the canvas content to a Data URL with base64 encoding
      const dataUrl = canvas.toDataURL("image/png");

      // Return the Data URL
      return dataUrl;
    } catch (error) {
      console.error("Error capturing screenshot:", error);
      return null;
    }
  }

  async reportUIBug(errorData) {
    try {
      const screenshotUrl = await this.captureScreenshot();

      // Check if screenshot capture was successful
      if (screenshotUrl) {
        errorData.screenshot = screenshotUrl; // Attach the URL to errorData

        // Send the error data, including the screenshot URL, to the server
        const response = await fetch(this.apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ error: errorData }),
        });

        const data = await response.json();
        console.log("UI bug report sent:", data);
      } else {
        console.error(
          "Failed to capture screenshot. Sending bug report without it."
        );

        // Send error data without screenshot
        await fetch(this.apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ error: errorData }),
        });
      }
    } catch (error) {
      console.error("Error sending UI bug report:", error);
    }
  }

  setupErrorListener() {
    const handleUIError = async (errorEvent) => {
      // Report the UI-related error to the server using the BugReporter
      const errorData = {
        errorMessage: errorEvent.error.message,
        stackTrace: errorEvent.error.stack,
        file: errorEvent.filename,
        lineNumber: errorEvent.lineno,
        userAgent: navigator.userAgent,
        browser: getBrowserInfo(),
        operatingSystem: getOperatingSystem(),
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
