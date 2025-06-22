import '../App.css';
import { Button } from "./util.js"

function TopicInputForm({ topic, setter, onSubmit }) {
  return (
    <div className="App-form">
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
    </div>
  );
}

export default TopicInputForm; 
