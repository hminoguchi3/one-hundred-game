import '../App.css';

function ResponseInputForm({ topic, number, user, response, onInputChange, onSubmit }) {
    return (
        <div>
            {user}のお題: {topic}<br />
            あなたの数字は{number}です<br /><br />
            <input
                type="text"
                id="response"
                name="response"
                value={response}
                onChange={onInputChange}
            />
            <button onClick={onSubmit}>決定</button>
        </div>
    );
}

export default ResponseInputForm; 
