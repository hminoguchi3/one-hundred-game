import '../App.css';
import { Button } from "./util.js"

function TopicInputForm({ topic, setter, onSubmit, getRandomTopic }) {
  return (
    <div className="App-form-only-wrapper">
      <div className="App-form" style={{ width: "90%" }}>
        お題: <input
          type="text"
          id="topic"
          className="inputTextBox"
          name="topic"
          value={topic}
          onChange={(event) => {
            setter(event.target.value);
          }}
        /><br />
        <Button onClick={onSubmit}>決定</Button>
        <Button onClick={getRandomTopic}>I'm feeling lucky</Button>
      </div>
    </div>
  );
}

export default TopicInputForm; 
