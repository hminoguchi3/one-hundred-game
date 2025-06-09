import React, { useState } from 'react';
import { useRoomManagement } from '../../hooks/useRoomManagement';
import { useSocketEvents } from '../../hooks/useSocketEvents';
import UserInputForm from '../UserInputForm/UserInputForm'; // New component
import RoomDisplay from '../RoomDisplay/RoomDisplay'; // New component
import './AccessRoom.module.css'; // Or AccessRoom.css if not using CSS Modules

function AccessRoom() {
  const [accessRoomRequest, setAccessRoomRequest] = useState({
    roomId: '',
    userId: ''
  });

  const {
    currentRoomId,
    usersInRoom,
    loading,
    error,
    accessRoom,
    refreshUsers
  } = useRoomManagement();

  useSocketEvents(currentRoomId, refreshUsers); // Pass currentRoomId and refreshUsers

  const handleTextInputChange = (event) => {
    const { name, value } = event.target;
    setAccessRoomRequest(prevAccessRoomRequest => ({
      ...prevAccessRoomRequest,
      [name]: value
    }));
  };

  const handleAccessRoom = () => {
    accessRoom(accessRoomRequest);
  };

  if (error) {
    return (
      <div>
        <p>データの取得に失敗しました: {error.message}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <p>データをロード中です...</p>
      </div>
    );
  }

  if (currentRoomId) {
    return <RoomDisplay roomId={currentRoomId} users={usersInRoom} />;
  }

  return (
    <UserInputForm
      roomId={accessRoomRequest.roomId}
      userId={accessRoomRequest.userId}
      onInputChange={handleTextInputChange}
      onSubmit={handleAccessRoom}
    />
  );
}

export default AccessRoom;