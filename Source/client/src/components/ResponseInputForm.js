import '../App.css';

function ResponseInputForm({ topic, number, user, submittedResponses, response, onInputChange, onSubmit }) {
    console.log(submittedResponses);
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
            <button onClick={onSubmit}>決定</button><br />
            <pre>他の人の回答</pre>
            <ul>
                {submittedResponses.map((obj, index) => (
                    <li key={index}>{obj.userId}さん：{obj.response}</li>
                ))}
            </ul>
        </div>
    );
}

export default ResponseInputForm; 
