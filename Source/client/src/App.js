import logo from './kishi.png';
import './App.css';
import React, { useEffect, useState } from 'react';
import EnterRoomInputForm from './components/EnterRoomInputForm';
import Lobby from './components/Lobby';
import ErrorPage from './components/ErrorPage';
import LoadingPage from './components/LoadingPage';
import TopicInputForm from './components/TopicInputForm';
import ResponseInputForm from './components/ResponseInputForm';
import { socket } from './utils/socket';
import { getUsersInRoomApi } from './utils/api';

function GameContents() {
  const State = {
    INIT: 'INIT',
    LOBBY: 'LOBBY',
    ENTER_TOPIC: 'ENTER_TOPIC',
    ENTER_RESPONSE: 'ENTER_RESPONSE',
    RESPONSE_SUBMITTED: 'RESPONSE_SUBMITTED'
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [state, setState] = useState(State.INIT);

  const [userId, setUserId] = useState('');
  const [response, setResponse] = useState('');
  const [card, setCard] = useState(-1);

  const [roomId, setRoomId] = useState('');
  const [topic, setTopic] = useState('');
  const [topicGivenUser, setTopicGivenUser] = useState('');
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [submittedResponses, setSubmittedResponses] = useState([]);

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

    return () => {
      // To be called when AccessRoom obj is no longer used.
      socket.disconnect();
    }
  }, []
  )

  // Called when entering a room.
  const accessRoom = async () => {
    setLoading(true); // ローディング開始
    setError(null);

    try {
      socket.emit('joinRoom', { userId, roomId });

      setState(State.LOBBY);
      setLoading(false);
      refreshUsers(roomId);

      // Listen for updates in the current room.
      // New user joined.
      socket.on('userJoined', (payload) => {
        refreshUsers(payload.roomId);
      }
      );
      // Game is started.
      socket.on('startGame', (payload) => {
        setState(State.ENTER_TOPIC);
      }
      );
      // A topic is submitted by one of the users.
      socket.on('topicSubmitted', (payload) => {
        console.log('topicSubmitted: ', payload);
        if (payload.topicGivenUserId === userId) {
          setTopicGivenUser('あなた');
        } else {
          setTopicGivenUser(payload.topicGivenUserId + 'さん');
        }
        setTopic(payload.topic);
        setCard(payload.card);
        setState(State.ENTER_RESPONSE);
        socket.on('responseUpdated', (payload) => {
          console.log("responseUpdated: ", payload);
          setSubmittedResponses(payload.submittedResponses);
        });
      }
      );
    } catch (error) {
      setError(error);
    }
  };

  const startGame = async () => {
    socket.emit('startGame', { roomId });
  }

  const topicSubmitted = async () => {
    socket.emit('setTopic', { userId, roomId, topic });
    setState(State.ENTER_RESPONSE);
  };

  const ResponseSubmitted = async () => {
    socket.emit('submitResponse', { userId, roomId, response });
    setState(State.RESPONSE_SUBMITTED);
  };

  const refreshUsers = async (roomId) => {
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
        number={card}
        topicGivenUser={topicGivenUser}
        topicSubmitted={State == State.RESPONSE_SUBMITTED}
        submittedResponses={submittedResponses}
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
        <GameContents />
      </header>
    </div >);
}

export default App; 
