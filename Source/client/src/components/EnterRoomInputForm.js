import '../App.css';

function EnterRoomInputForm({roomId, userId, onInputChange, onSubmit}) {
  return (
    <div>
      部屋の名前: <input
        type="text"
        id="roomId"
        name="roomId"
        value={roomId}
        onChange={onInputChange}
      /><br />
      プレイヤーの名前:
      <input
        type="text"
        id="userId"
        name="userId"
        value={userId}
        onChange={onInputChange}
      /><br />
      <button onClick={onSubmit}>決定</button>
    </div>
  );
}

export default EnterRoomInputForm; 
