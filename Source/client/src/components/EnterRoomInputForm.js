import '../App.css';
import { Button } from "./util.js"

function EnterRoomInputForm({ roomId, userId, roomIdSetter, userIdSetter, onSubmit }) {
  return (
    <div className="App-form">
      部屋の名前: <input
        className="inputTextBox"
        type="text"
        id="roomId"
        name="roomId"
        value={roomId}
        onChange={(event) => {
          roomIdSetter(event.target.value);
        }}
      /><br />
      プレイヤーの名前:
      <input
        className="inputTextBox"
        type="text"
        id="userId"
        name="userId"
        value={userId}
        onChange={(event) => {
          userIdSetter(event.target.value);
        }}
      /><br />
      <Button onClick={onSubmit}>決定</Button>
    </div>
  );
}

export default EnterRoomInputForm; 
