import '../App.css';
import { GetCorrectness } from './util.js';

function DecideRank({ responses, onClick }) {
  return (
    <div>
      <ul>
        {responses.map((obj, index) => (
          <li key={index}>{obj.userId}さんの回答：{obj.response}  数は{GetCorrectness(obj.correct, obj.card)}でした。</li>
        ))}
      </ul>
      <button onClick={onClick}>もう一度プレイ</button>
    </div>
  );
}

export default DecideRank; 
