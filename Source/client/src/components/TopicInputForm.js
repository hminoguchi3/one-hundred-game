import '../App.css';

function TopicInputForm({topic, onInputChange, onSubmit}) {
  return (
    <div>
      お題: <input
        type="text"
        id="topic"
        name="topic"
        value={topic}
        onChange={onInputChange}
      />
      <button onClick={onSubmit}>決定</button>
    </div>
  );
}

export default TopicInputForm; 
