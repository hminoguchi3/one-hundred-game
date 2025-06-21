import '../App.css';

function Lobby({roomId, usersInRoom, onStart}) {
  return (
  <div>
        <pre>ようこそ {roomId} へ</pre>
        <pre>現在参加しているプレイヤー: </pre>
        <ul>
          {usersInRoom.map((str, index) => (
            <li key={index}>{str}</li>
          ))}
        </ul>
      <button onClick={onStart}>ゲームを始める</button>
      </div>
  );
}

export default Lobby; 
