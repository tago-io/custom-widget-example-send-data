import { h, render } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import "@tago/custom-widget";
import "@tago/custom-widget/dist/custom-widget.css"
import "./Widget.css";

function Widget() {
  const [varName, setVarName] = useState("");
  const [value, setValue] = useState("");
  const [response, setResponse] = useState("");

  useEffect(() => {
    window.TagoIO.onStart();
  }, []);

  // clears the return message when sending data
  const clearResponse = () => {
    setTimeout(() => {
      setResponse("");
    }, 3000);
  }

  const sendData = () => {
    const payload = [{ 
      variable: varName,
      value
    }];
    window.TagoIO.sendData(payload,
      // callback that runs when sendData returns
      (response) => {
        if (response.status) {
          setResponse("Data sent successfully");
        } else {
          setResponse(response.message);
        }
        clearResponse();
    })
  }

  return (
    <div className="container">
      <div>
        <input type="text" value={varName} onChange={(e) => setVarName(e.target.value)}/>
        <input type="text" value={value} onChange={(e) => setValue(e.target.value)}/>
        <button onClick={sendData}>Send data</button>
        {response && (
          <div className="alert">{response}</div>
        )}
      </div>
    </div>
  );
}

render(<Widget />, document.body);
