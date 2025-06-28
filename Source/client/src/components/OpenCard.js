import '../App.css';
import { Button } from "./util.js"
import { GetCorrectness } from './util.js';

function OpenCard({ responses, number, topic, openedCard, onClick }) {
  return (
    <div className="App-response-form-wrapper">
      <div className="App-card">
        {number}
      </div>
      <br />
      お題:{topic}
      <br />
      {!openedCard && (
        <>
          あなたのカードが一番低いと思ったらカードを出しましょう
        </>
      )}
      <div className="App-scrollable-container">
        {responses.map((obj) => (
          <div className="App-response-and-card">
            <div className="App-response">
              <div className="App-name">{obj.userId}</div>
              <div>{obj.response}</div>
            </div>
            <div className="App-card-small">{GetCorrectness(obj.correct, obj.card)}</div>
          </div>
        ))}
      </div>
      <div style={{ width: "90%" }}> {!openedCard && (
        <>
          <Button onClick={onClick}>カードを出す</Button>
        </>
      )}
      </div>
    </div>
  );
}

export default OpenCard; 
