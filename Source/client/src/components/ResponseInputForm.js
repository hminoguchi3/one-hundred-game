import '../App.css';
import { Button } from "./util.js"

function ResponseInputForm({ topic, number, topicGivenUser, topicSubmitted, submittedResponses, response, setter, onSubmit }) {
    return (
        <div className="App-wrapper">
            <div className="App-card">
                {number}
            </div>
            <div className="App-form">
                {topicGivenUser}のお題: {topic}<br />
                {!topicSubmitted && (
                    <>
                        この数字に合う物を入力しよう！
                        <input
                            type="text"
                            className="inputTextBox"
                            id="response"
                            name="response"
                            value={response}
                            onChange={(event) => {
                                setter(event.target.value);
                            }}
                        /><br />
                        <Button onClick={onSubmit}>決定</Button><br />
                    </>
                )}
                みんなの回答
                <ul>
                    {submittedResponses.map((obj, index) => (
                        <li key={index}>{obj.userId}さん：{obj.response}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default ResponseInputForm; 
