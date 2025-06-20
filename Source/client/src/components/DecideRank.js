import '../App.css';

function DecideRank({responses, onClick}) {
  return (
  <div>
        <ul>
          {responses.map((obj, index) => (
            <li key={index}>{obj.userId}さんの回答：{obj.response}   <button>UP</button><button>DOWN</button></li>
          ))}
        </ul>
      <button onClick={onClick}>決定</button>
      </div>
  );
}

export default DecideRank; 
