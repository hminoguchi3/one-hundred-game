import '../App.css';
import { GetCorrectness } from './util.js';
import { Button } from "./util.js"

function GetResult(responses) {
  for (const response of responses) {
    if (!response.correct) {
      return "残念！カードを出す順番を間違えました";
    }
  }
  return "おめでとうございます！すべてのカードを正しい順に出すことができました";
}

function DecideRank({ responses, topic, onClick }) {
  responses.sort((a, b) => {
    if (a.card < b.card) {
      return -1;
    }
    if (a.card > b.card) {
      return 1;
    }
    return 0;
  });

  return (
    <div style={{height: "80%" }}>
      {GetResult(responses)}
      <br /><br />
      お題:{topic}
      <br />
      <div className="App-scrollable-container" style={{ width: "100%", height: "50%" }}>
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
      <br />
      <Button onClick={onClick}>もう一度プレイ</Button>
    </div>
  );
}

export default DecideRank; 
