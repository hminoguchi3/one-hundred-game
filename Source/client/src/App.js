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
import { socket } from './utils/socket';
import { enterRoomApi, getUsersInRoomApi } from './utils/api';

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

  const [roomId, setRoomId] = useState('');
  const [userId, setUserId] = useState('');
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [topic, setTopic] = useState([]);
  const [state, setState] = useState(State.INIT);
  const [response, setResponse] = useState('');
  const [topicGivenUser, setTopicGivenUser] = useState('');
  const [card, setCard] = useState(-1);

  const handleEnterRoomInputChange = (event) => {
    const { name, value } = event.target;
    if (name == "userId") {
      setUserId(value);
    } else if (name == "roomId") {
      setRoomId(value);
    }
  };

  const handleTopicInputChange = (event) => {
    const { value } = event.target;
    setTopic(value);
  };

  const handleResponseInputChange = (event) => {
    const { value } = event.target;
    setResponse(value);
  };

  // To be called initially, only once.
  useEffect(() => {
    socket.connect();
    socket.on('socketError', (payload) => {
      setError(payload);
    });
    socket.on('topicUpdated', (payload) => {
      console.log('topicUpdated: ', payload);
      if (payload.userId === userId) {
        setTopicGivenUser('あなた');
      } else {
        setTopicGivenUser(payload.userId + 'さん');
      }
      setTopic(payload.topic);
      setCard(payload.card);
      setState(State.ENTER_RESPONSE);
    }
    );
    return () => {
      // To be called when AccessRoom obj is no longer used.
      socket.disconnect();
    }
  }, []
  )

  const accessRoom = async () => {
    setLoading(true); // ローディング開始
    setError(null);

    try {
      socket.emit('joinRoom', { userId, roomId });
      refreshUsers(roomId);
      setLoading(false);
      setState(State.LOBBY);
      socket.on('userJoined', (payload) => {
        console.log(payload);
        refreshUsers(payload.roomId);
      }
      );
      socket.on('startGame', (payload) => {
        console.log("Start game: " + payload);
        startGame();
      }
      );
    } catch (error) {
      setError(error);
    }
  };

  const submitTopic = async () => {
    socket.emit('startGame', { roomId });
  }

  const startGame = async () => {
    console.log("Starting game!");
    setState(State.ENTER_TOPIC);
  };

  const topicSubmitted = async () => {
    socket.emit('setTopic', { userId, roomId, topic });
    setState(State.ENTER_RESPONSE);
  };

  const ResponseSubmitted = async () => {
    console.log("Response submitted!");
    setState(State.RESPONSE_SUBMITTED);
  };

  // useEffect is called when dependencies (roomId) is updated.
  const refreshUsers = async (roomId) => {
    console.log("Refresh users!");
    console.log("Current room id: " + roomId);
    setLoading(true); // ローディング開始
    try {
      const jsonData = await getUsersInRoomApi(roomId);
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
        roomId={roomId}
        userId={userId}
        onInputChange={handleEnterRoomInputChange}
        onSubmit={accessRoom} />;
    case State.LOBBY:
      return <Lobby
        roomId={roomId}
        usersInRoom={usersInRoom}
        onStart={submitTopic} />;
    case State.ENTER_TOPIC:
      return <TopicInputForm
        topic={topic}
        onInputChange={handleTopicInputChange}
        onSubmit={topicSubmitted} />;
    case State.ENTER_RESPONSE:
    case State.RESPONSE_SUBMITTED:
      return <ResponseInputForm
        topic={topic}
        number={card}
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
