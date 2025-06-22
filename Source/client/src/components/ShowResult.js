import '../App.css';
import { GetCorrectness } from './util.js';
import { Button } from "./util.js"

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
    <div className="App-form">
      <ul>
        {responses.map((obj, index) => (
          <li key={index}>{obj.userId}さんの回答：{obj.response}  {GetCorrectness(obj.correct, obj.card)}</li>
        ))}
      </ul>
      <Button onClick={onClick}>もう一度プレイ</Button>
    </div>
  );
}

export default DecideRank; 
