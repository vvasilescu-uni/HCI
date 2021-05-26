import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Chat from './Chat';

const initialState = {
  username: '',
  roomId: '',
  showModal: false,
};

function App() {
  const [state, setState] = useState(initialState);

  const onEnter = () => {
    if (state.username === '' || state.roomId === '') {
      return;
    }

    setState(s => ({ ...s, showModal: true }))
  };

  return (
    <div className="App">
      <div className="container" style={{ marginTop: 100, width: 500 }}>
        <div className="row">
          <div className="col">
            <div className="card">
              <div className="card-body">
                <form>
                  <div className="mb-3" style={{ textAlign: 'left' }}>
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                      id="username"
                      type="text"
                      className="form-control"
                      value={state.username}
                      onChange={(event) => setState({ ...state, username: event.target.value })}
                    />
                  </div>
                  <div className="mb-3" style={{ textAlign: 'left' }}>
                    <label htmlFor="roomId" className="form-label">Room ID</label>
                    <input
                      id="roomId"
                      type="text"
                      className="form-control"
                      value={state.roomId}
                      onChange={(event) => setState({ ...state, roomId: event.target.value })}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => onEnter()}
                  >
                    Enter
                  </button>
                </form>
              </div>
              <Chat
                username={state.username}
                roomId={state.roomId}
                showModal={state.showModal}
                closeModal={() => setState(s => ({ ...s, showModal: false }))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
