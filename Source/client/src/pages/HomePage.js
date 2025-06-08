
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentRoomId, setcurrentRoomId] = useState('');
  const [usersInRoom, setUsersInRoom] = useState([]);

  const [accessRoomRequest, setaccessRoomRequest] = useState({
    roomId: '',
    userId: ''
  });

  const handleTextInputChange = (event) => {
    const { name, value } = event.target;
    setaccessRoomRequest(prevaccessRoomRequest => ({
      ...prevaccessRoomRequest, // Keep existing accessRoomRequest properties
      [name]: value     // Update the specific property that changed
    }));
  };

  // Called to update current participants list
  const updateParticipantsList = (userId) => {
    alert(userId + " has joined!")
  };

  // Called when entering room id and name.
  const accessRoomId = () => {
    const socket = io('http://localhost:3001');
    socket.emit('joinRoom', accessRoomRequest);
    socket.on('userJoined', ({ userId }) =>
      updateParticipantsList(userId)
    );
    setLoading(true); // ローディング開始
    fetch('http://localhost:5000/api/room', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // 送信するデータの形式を指定
      },
      body: JSON.stringify(accessRoomRequest), // JavaScriptオブジェクトをJSON文字列に変換して送信
    })
      .then(response => {
        setLoading(false); // ローディング完了
        if (!response.ok) {
          const errorMessage = response.text();
          throw new Error(`HTTPエラーです！ステータス: ${response.status}, メッセージ: ${errorMessage}`);
        }
        return response.json(); // レスポンスをJSONとして解析
      })
      .then(jsonData => {
        if (jsonData.error){
          setErrorMessage(jsonData.error)
          return null
        }
        setcurrentRoomId(jsonData.roomId);
        setUsersInRoom(jsonData.users)
      })
      .catch(error => {
        setErrorMessage(error.message);
      });
  };

  if (errorMessage) {
    return (
      <div>
        <p>データの取得に失敗しました: {errorMessage}</p>
      </div>);
  }

  if (loading) {
    return (
      <div>
        <p>データをロード中です...</p>
      </div>);
  }

  if (currentRoomId != '') {
    return (
      <div>
        <pre>ようこそ {currentRoomId} へ</pre>
        <pre>現在参加しているプレイヤー: </pre>
        <ul>
          {usersInRoom.map((str, index) => (
            <li key={index}>{str}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
      部屋の名前: <input
        type="text"
        id="roomId"
        name="roomId"
        value={accessRoomRequest.roomId}
        onChange={handleTextInputChange}
      /><br />
      プレイヤーの名前:
      <input
        type="text"
        id="userId"
        name="userId"
        value={accessRoomRequest.userId}
        onChange={handleTextInputChange}
      /><br />
      <button onClick={accessRoomId}>決定</button>
    </div>
  );
}

export default HomePage; 
