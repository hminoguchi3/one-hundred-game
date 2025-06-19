import logo from './kishi.png';
import './App.css';
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import EnterRoomInputForm from './components/EnterRoomInputForm';
import Lobby from './components/Lobby';
import ErrorPage from './components/ErrorPage';
import LoadingPage from './components/LoadingPage';
import TopicInputForm from './components/TopicInputForm';
import ResponseInputForm from './components/ResponseInputForm';

function AccessRoom() {
  const State = {
    INIT: 'INIT',
    LOBBY: 'LOBBY',
    ENTER_TOPIC: 'ENTER_TOPIC',
    ENTER_RESPONSE: 'ENTER_RESPONSE',
    RESPONSE_SUBMITTED: 'RESPONSE_SUBMITTED'
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentRoomId, setCurrentRoomId] = useState('');
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [topic, setTopic] = useState([]);
  const [state, setState] = useState(State.INIT);
  const [response, setResponse] = useState('');
  const [topicGivenUser, setTopicGivenUser] = useState('');

  const [accessRoomRequest, setaccessRoomRequest] = useState({
    roomId: '',
    userId: ''
  });

  const handleEnterRoomInputChange = (event) => {
    const { name, value } = event.target;
    setaccessRoomRequest(prevaccessRoomRequest => ({
      ...prevaccessRoomRequest, // Keep existing accessRoomRequest properties
      [name]: value     // Update the specific property that changed
    }));
  };

  const handleTopicInputChange = (event) => {
    const { value } = event.target;
    setTopic(value);
  };

  const handleResponseInputChange = (event) => {
    const { value } = event.target;
    setResponse(value);
  };

  const accessRoom = async () => {
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
      setState(State.LOBBY);
      const socket = io('http://localhost:3001');
      socket.on('userJoined', (payload) => {
        console.log(payload);
        refreshUsers(payload.roomId);
      }
      );
      socket.on('startGame', (payload) => {
        console.log("Start game: " + payload);
        setState(State.ENTER_TOPIC);
      }
      );
      socket.emit('joinRoom', { userId: accessRoomRequest.userId, roomId: jsonData.roomId });
    } catch (error) {
      setError(error);
    }
  };

  const startGame = async () => {
    console.log("Starting game!");
    setState(State.ENTER_TOPIC);
    const socket = io('http://localhost:3001');
    socket.on('topicUpdated', (payload) => {
      console.log('topicUpdated: ' + payload);
      if (payload.userId === accessRoomRequest.userId) {
        setTopicGivenUser('あなた');
      } else {
        setTopicGivenUser(payload.userId);
      }
      setTopic(payload.topic);
      setState(State.ENTER_RESPONSE);
    }
    );
    socket.emit('startGame', { roomId: currentRoomId });
  };

  const topicSubmitted = async () => {
    const socket = io('http://localhost:3001');
    socket.emit('setTopic', { userId: accessRoomRequest.userId, roomId: currentRoomId, topic: topic });
    setState(State.ENTER_RESPONSE);
  };

  const ResponseSubmitted = async () => {
    console.log("Response submitted!");
    setState(State.RESPONSE_SUBMITTED);
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
    return <ErrorPage
      errorMessage={error.message} />;
  }

  if (loading) {
    return <LoadingPage />
  }

  switch (state) {
    case State.INIT:
      return <EnterRoomInputForm
        roomId={accessRoomRequest.roomId}
        userId={accessRoomRequest.userId}
        onInputChange={handleEnterRoomInputChange}
        onSubmit={accessRoom} />;
    case State.LOBBY:
      return <Lobby
        roomId={currentRoomId}
        usersInRoom={usersInRoom}
        onStart={startGame} />;
    case State.ENTER_TOPIC:
      return <TopicInputForm
        topic={topic}
        onInputChange={handleTopicInputChange}
        onSubmit={topicSubmitted} />;
    case State.ENTER_RESPONSE:
    case State.RESPONSE_SUBMITTED:
      return <ResponseInputForm
        topic={topic}
        number="2"
        user={topicGivenUser}
        response={response}
        onInputChange={handleResponseInputChange}
        onSubmit={ResponseSubmitted} />;
    default:
      return <ErrorPage
        errorMessage={"undefined state"} />;
  }
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
