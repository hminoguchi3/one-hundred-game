import logo from './kishi.png';
import './App.css';
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function AccessRoom() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentRoomId, setCurrentRoomId] = useState('');
  // const [userName, setUserName] = useState('');
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

  const accessRoomId = async () => {
    setLoading(true); // ローディング開始
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // 送信するデータの形式を指定
        },
        body: JSON.stringify(accessRoomRequest), // JavaScriptオブジェクトをJSON文字列に変換して送信
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`HTTPエラーです！ステータス: ${response.status}, メッセージ: ${errorMessage}`);
      }

      const jsonData = await response.json();
      setCurrentRoomId(jsonData.roomId);
      setUsersInRoom(jsonData.users);
      setLoading(false);
      const socket = io('http://localhost:3001');
      socket.on('userJoined', (payload) => {
        console.log(payload);
        refreshUsers(payload.roomId);
      }
      );
      socket.emit('joinRoom', { userId: accessRoomRequest.userId, roomId: jsonData.roomId });
    } catch (error) {
      setError(error);
    }
  };

  // useEffect is called when dependencies (currentRoomId) is updated.
  const refreshUsers = async (roomId) => {
    console.log("Refresh users!");
    console.log("Current room id: " + roomId);
    setLoading(true); // ローディング開始
    try {
      const response = await fetch(`http://localhost:5000/api/room/${roomId}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json', // 送信するデータの形式を指定
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();  // Try parsing json response
        throw new Error(`HTTPエラーです！ステータス: ${response.status}, メッセージ: ${errorMessage}`);
      }

      const jsonData = await response.json();
      setUsersInRoom(jsonData.users)
      setLoading(false);
    } catch (error) {
      setError(error);
    }
  }

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
