import '../App.css';

function DecideRank({responses, onClick}) {
  return (
  <div>
        <ul>
          {responses.map((obj, index) => (
            <li key={index}>{obj.userId}さんの回答：{obj.response}  数は{obj.card}でした。</li>
          ))}
        </ul>
      <button onClick={onClick}>もう一度プレイ</button>
      </div>
  );
}

export default DecideRank; 
