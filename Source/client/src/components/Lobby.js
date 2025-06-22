import '../App.css';
import { Button } from "./util.js"

function Lobby({ roomId, usersInRoom, onStart }) {
  return (
    <div className="App-form">
      {roomId}
      <br /><br />
      現在参加しているプレイヤー
      <br />
      <ul>
        {usersInRoom.map((str, index) => (
          <li key={index}>{str}</li>
        ))}
      </ul>
      <Button onClick={onStart}>ゲームを始める</Button>
    </div>
  );
}

export default Lobby; 
