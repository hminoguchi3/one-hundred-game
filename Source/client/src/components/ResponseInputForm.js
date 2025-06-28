import '../App.css';
import { Button } from "./util.js"

function ResponseInputForm({ topic, number, topicGivenUser, topicSubmitted, submittedResponses, response, setter, onSubmit }) {
    return (
        <div className="App-response-form-wrapper">
            <div className="App-card">
                {number}
            </div>
            <div className="App-form-and-response">
                <div className="App-form">
                    {topicGivenUser}のお題<br />
                    {topic}<br /><br />
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
                            <Button onClick={onSubmit}>決定</Button>
                        </>
                    )}
                    {topicSubmitted && (
                        <>
                            <br />他のプレイヤーを待っています。
                        </>
                    )}
                </div>
                <div className="App-responses">
                    <br />みんなの回答
                    {submittedResponses.map((obj) => (
                        <div className="App-response">
                            <div className="App-name">{obj.userId}</div>
                            <div>{obj.response}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ResponseInputForm; 
