import '../App.css';
import { Button } from "./util.js"

function Lobby({ roomId, usersInRoom, onStart }) {
  return (
    <div className="App-form-only-wrapper">
      <div className="App-form" style={{ width: "90%" }}>
        {roomId}
        <br />
        現在参加しているプレイヤー
        <br />
        <div className = "App-scrollable-container">
        {usersInRoom.map((str) => (
          <div className="App-participant">{str}</div>
        ))}
        </div>
        <Button onClick={onStart}>ゲームを始める</Button>
      </div>
    </div>
  );
}

export default Lobby; 
