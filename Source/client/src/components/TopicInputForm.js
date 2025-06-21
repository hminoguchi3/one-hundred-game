import '../App.css';

function TopicInputForm({ topic, setter, onSubmit }) {
  return (
    <div>
      お題: <input
        type="text"
        id="topic"
        name="topic"
        value={topic}
        onChange={(event) => {
          setter(event.target.value);
        }}
      />
      <button onClick={onSubmit}>決定</button>
    </div>
  );
}

export default TopicInputForm; 
