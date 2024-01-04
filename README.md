A comprehensive bug tracking tool tailored for React, ensuring that no UI bug goes unnoticed!

## Development 🔧

- Install Dependency

```sh
npm install react-bug-tracker
```

## Example Setup

```javascript
import BugReporter from "react-bug-tracker";

// pass server endpoint where you need to store the bug report
const report = new BugReporter("https://your-api-endpoint.com/report");

// Set up the error listener when the script loads
const cleanupErrorListener = bugReporter.setupErrorListener();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Clean up the error listener when the component unmounts
if (cleanupErrorListener) {
  window.addEventListener("beforeunload", cleanupErrorListener);
}
```

### Author ✨

<table>
  <tr>
    <td align="center"><a href="https://github.com/singhshubham98"><img src="https://github.com/singhshubham98/react-bug-tracker/assets/25260334/a1ce456f-81da-4b97-ba46-07d4a59b7035" width="100px;" alt=""/><br /><sub><b>Shubham Singh</b></sub></a><br /></td>
  </tr>
</table>
