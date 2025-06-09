import logo from './kishi.png';
import './App.css';
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function AccessRoom() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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

  const accessRoomId = () => {
    const socket = io('http://localhost:3001');
    socket.emit('joinRoom', accessRoomRequest);
    socket.on('userJoined', ({ userId }) =>
      alert(`${userId} just joined!`)
    );
    // setLoading(true); // ローディング開始
    // fetch('http://localhost:5000/api/room', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json', // 送信するデータの形式を指定
    //   },
    //   body: JSON.stringify(accessRoomRequest), // JavaScriptオブジェクトをJSON文字列に変換して送信
    // })
    //   .then(response => {
    //     setLoading(false); // ローディング完了
    //     if (!response.ok) {
    //       const errorMessage = response.text();
    //       throw new Error(`HTTPエラーです！ステータス: ${response.status}, メッセージ: ${errorMessage}`);
    //     }
    //     return response.json(); // レスポンスをJSONとして解析
    //   })
    //   .then(jsonData => {
    //     setcurrentRoomId(jsonData.roomId);
    //     setUsersInRoom(jsonData.users)
    //   })
    //   .catch(error => {
    //     setError(error); // エラーをstateに保存
    //   });
  };

  if (error) {
    return (
      <div>
        <p>データの取得に失敗しました: {error.message}</p>
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

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hello Mizuki!
        </p>
        <AccessRoom />
      </header>
    </div >);
}

export default App; 
