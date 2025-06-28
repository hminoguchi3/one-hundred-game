import '../App.css';
import { Button } from "./util.js"

function EnterRoomInputForm({ roomId, userId, roomIdSetter, userIdSetter, onSubmit, showRule }) {
  return (
    <div className="App-form-only-wrapper">
      <div className="App-form" style={{ width: "90%" }}>
        部屋のあいことば: <input
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
        <Button onClick={showRule}>遊び方</Button>
      </div>
    </div>
  );
}

export default EnterRoomInputForm; 
