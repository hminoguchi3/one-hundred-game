import '../App.css';

function ResponseInputForm({ topic, number, topicGivenUser, topicSubmitted, submittedResponses, response, onInputChange, onSubmit }) {
    console.log(submittedResponses);
    console.log(topicSubmitted);
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
                        onChange={onInputChange}
                    />
                    <button onClick={onSubmit}>決定</button><br />
                </>
            )}
            <pre>みんなの人の回答</pre>
            <ul>
                {submittedResponses.map((obj, index) => (
                    <li key={index}>{obj.userId}さん：{obj.response}</li>
                ))}
            </ul>
        </div>
    );
}

export default ResponseInputForm; 
