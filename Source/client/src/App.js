import './App.css';
import React, { useEffect, useState } from 'react';
import EnterRoomInputForm from './components/EnterRoomInputForm';
import Rule from './components/Rule';
import Lobby from './components/Lobby';
import ErrorPage from './components/ErrorPage';
import LoadingPage from './components/LoadingPage';
import TopicInputForm from './components/TopicInputForm';
import WebPageTemplate from './components/WebPageTemplate';
import ResponseInputForm from './components/ResponseInputForm';
import OpenCard from './components/OpenCard';
import ShowResult from './components/ShowResult';
import { socket } from './utils/socket';
import { randomTopic } from './utils/constants';

function GameContents() {
  const State = {
    INIT: 'INIT',
    SHOW_RULE: 'SHOW_RULE',
    LOBBY: 'LOBBY',
    ENTER_TOPIC: 'ENTER_TOPIC',
    ENTER_RESPONSE: 'ENTER_RESPONSE',
    RESPONSE_SUBMITTED: 'RESPONSE_SUBMITTED',
    OPEN_CARD: 'OPEN_CARD',
    OPENED_CARD: 'OPENED_CARD',
    SHOW_RESULT: 'SHOW_RESULT'
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

  // To be called initially, only once.
  useEffect(() => {
    socket.connect();
    socket.on('socketError', (payload) => {
      setError(payload);
    });

    // Listen for updates in the current room.
    // New user joined.
    socket.on('userJoined', (payload) => {
      console.log('userJoined: ', payload);
      setUsersInRoom(payload.users);
    }
    );

    return () => {
      // To be called when AccessRoom obj is no longer used.
      socket.disconnect();
    }
  }, []
  )

  // Called when entering a room.
  const accessRoom = async () => {
    setError(null);

    try {
      resetStatesForNewGame();
      socket.emit('joinRoom', { userId, roomId });
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
      }
      );
      // A response is submitted by one of the users.
      socket.on('responseUpdated', (payload) => {
        console.log("responseUpdated: ", payload);
        setSubmittedResponses(payload.responses);
        if (payload.allResponseSubmitted) {
          setState(State.OPEN_CARD);
        }
      });
      socket.on('cardOpened', (payload) => {
        console.log("cardOpened: ", payload);
        const { allCardsOpened, responses } = payload;
        setSubmittedResponses(responses);
        if (allCardsOpened) {
          setState(State.SHOW_RESULT);
        }
      });
      socket.on('playAgain', () => {
        resetStatesForNewGame();
      });
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

  const submitResponse = async () => {
    socket.emit('submitResponse', { userId, roomId, response });
    setState(State.RESPONSE_SUBMITTED);
  };

  const openCard = async () => {
    socket.emit('openCard', { roomId, userId });
    setState(State.OPENED_CARD);
  };

  const playAgain = async () => {
    socket.emit('playAgain', { roomId });
  };

  const resetStatesForNewGame = () => {
    setState(State.LOBBY);
    setResponse('');
    setCard(-1);
    setTopic('');
    setTopicGivenUser('');
    setSubmittedResponses([]);
  };

  if (error) {
    return <ErrorPage
      errorMessage={error.message} />;
  }

  if (loading) {
    return <LoadingPage />
  }

  function getRandomTopic() {
    const index = Math.floor(Math.random() * randomTopic.length);
    setTopic(randomTopic[index]);
  }

  switch (state) {
    case State.INIT:
      return <EnterRoomInputForm
        roomId={roomId}
        userId={userId}
        roomIdSetter={setRoomId}
        userIdSetter={setUserId}
        onSubmit={accessRoom}
        showRule={() => setState(State.SHOW_RULE)} />;
    case State.SHOW_RULE:
      return <Rule
        onClose={() => setState(State.INIT)} />;
    case State.LOBBY:
      return <Lobby
        roomId={roomId}
        usersInRoom={usersInRoom}
        onStart={startGame} />;
    case State.ENTER_TOPIC:
      return <TopicInputForm
        topic={topic}
        setter={setTopic}
        onSubmit={topicSubmitted}
        getRandomTopic={getRandomTopic} />;
    case State.ENTER_RESPONSE:
    case State.RESPONSE_SUBMITTED:
      return <ResponseInputForm
        topic={topic}
        number={card}
        topicGivenUser={topicGivenUser}
        topicSubmitted={state === State.RESPONSE_SUBMITTED}
        submittedResponses={submittedResponses}
        response={response}
        setter={setResponse}
        onSubmit={submitResponse} />;
    case State.OPEN_CARD:
    case State.OPENED_CARD:
      return <OpenCard
        responses={submittedResponses}
        number={card}
        openedCard={state === State.OPENED_CARD}
        onClick={openCard}
      />;
    case State.SHOW_RESULT:
      return <ShowResult
        responses={submittedResponses}
        onClick={playAgain}
      />;
    default:
      return <ErrorPage
        errorMessage={"undefined state"} />;
  }
}

function App() {
  return WebPageTemplate({ contents: GameContents() });
}

export default App; 
