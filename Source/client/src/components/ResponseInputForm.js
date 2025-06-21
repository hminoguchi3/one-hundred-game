import '../App.css';

function ResponseInputForm({ topic, number, topicGivenUser, topicSubmitted, submittedResponses, response, setter, onSubmit }) {
    return (
        <div>
            {topicGivenUser}のお題: {topic}<br />
            あなたの数字は{number}です<br /><br />
            {!topicSubmitted && (
                <>
                    <input
                        type="text"
                        id="response"
                        name="response"
                        value={response}
                        onChange={(event) => {
                            setter(event.target.value);
                        }}
                    />
                    <button onClick={onSubmit}>決定</button><br />
                </>
            )}
            <pre>みんなの回答</pre>
            <ul>
                {submittedResponses.map((obj, index) => (
                    <li key={index}>{obj.userId}さん：{obj.response}</li>
                ))}
            </ul>
        </div>
    );
}

export default ResponseInputForm; 
