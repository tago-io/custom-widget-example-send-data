import { h, render } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import "@tago/custom-widget";
import "@tago/custom-widget/dist/custom-widget.css"
import "./Widget.css";

function Widget() {
  const [widgetTitle, setWidgetTitle] = useState("");
  const [variable, setVariable] = useState({});
  // input text
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");

  useEffect(() => {
    window.TagoIO.onStart(null, (widget) => {
      setWidgetTitle(widget.label);
      // get the name of the first variable
      setVariable({ variable: widget.display.variables[0].variable });
    });

    window.TagoIO.onRealtime((data) => {
      // get the last variable from realtime
      if (data && data.result.length) {
        setVariable({
          variable: data.result[0].variable,
          value: data.result[0].value,
        })
      }
    })
  }, []);

  // clears the return message when sending data
  const clearResponse = () => {
    setTimeout(() => {
      setResponse("");
    }, 3000);
  }

  const sendData = () => {
    const payload = [{ 
      ...variable,
      value: text 
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
        <h1>{widgetTitle}</h1>
        <h2>Variable: {variable.variable}</h2>
        <h2>Value: {variable.value}</h2>
      </div>
      <div>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)}/>
        <button onClick={sendData}>Send data</button>
        {response && (
          <div className="alert">{response}</div>
        )}
      </div>
    </div>
  );
}

render(<Widget />, document.body);
