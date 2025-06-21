import '../App.css';

function EnterRoomInputForm({ roomId, userId, roomIdSetter, userIdSetter, onSubmit }) {
  return (
    <div>
      部屋の名前: <input
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
        type="text"
        id="userId"
        name="userId"
        value={userId}
        onChange={(event) => {
          userIdSetter(event.target.value);
        }}
      /><br />
      <button onClick={onSubmit}>決定</button>
    </div>
  );
}

export default EnterRoomInputForm; 
