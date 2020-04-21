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
    const options = {
      // complete the variables with the bucket and origin ids (if this option is false, this information needs to be passed)
      // autoFill can be a problem if you have two variables with the same name in different buckets
      autoFill: true,
    }
    window.TagoIO.sendData(payload, options, 
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
