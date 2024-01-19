import React, { useEffect, useState } from "react";
import "./CreateRoom.css"; // Import the style file

function CreateRoom({ socket }) {
  const [userName, setUserName] = useState("");
  const [stack, setStack] = useState("");

  const handleRoomCreate = (roomId) => {
    console.log(roomId);
    window.location.replace(`/games/${roomId}`);
  };

  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };

  const handleStackChange = (event) => {
    setStack(parseInt(event.target.value));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      userName: userName,
      stack: stack,
      seat_no: 1,
    };

    socket.emit("createRoom", data);

    socket.on("roomCreated", handleRoomCreate);
  };

  return (
    <div className="createRoom_container">
      <div className="createRoom_content">
        <h2>Create New Game</h2>
        <form onSubmit={handleSubmit}>
          <div className="form_group">
            <label htmlFor="userName">User Name:</label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={handleUserNameChange}
            />
          </div>
          <div className="form_group">
            <label htmlFor="stack">Stack:</label>
            <input
              type="text"
              id="stack"
              value={stack}
              onChange={handleStackChange}
            />
          </div>
          <button type="submit" className="createRoom_button">
            Create Room
          </button>
        </form>
      </div>
      <div className="createRoom_triangle_left"></div>
      <div className="createRoom_triangle_right"></div>
    </div>
  );
}

export default CreateRoom;
