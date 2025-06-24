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

function DecideRank({ responses, onClick }) {
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
    <div>
      {GetResult(responses)}
      {responses.map((obj) => (
        <div className="App-response-and-card">
          <div className="App-response">
            <div className="App-name">{obj.userId}さん</div>
            <div>{obj.response}</div>
          </div>
          <div className="App-card-small">{GetCorrectness(obj.correct, obj.card)}</div>
        </div>
      ))}
      <Button onClick={onClick}>もう一度プレイ</Button>
    </div>
  );
}

export default DecideRank; 
