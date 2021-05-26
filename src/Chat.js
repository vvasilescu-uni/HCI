import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const initialState = {
  messages: [],
  currentMessage: '',
};

function Chat({ username, roomId, showModal, closeModal }) {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    setState(initialState);
    const eventSource = new EventSource('http://vvasilescu.go.ro/.well-known/mercure?topic=' + roomId);

    eventSource.onmessage = event => {
      const data = JSON.parse(event.data);
      setState(s => ({
        ...s,
        messages: [data, ...s.messages],
      }));
    };

    return (() => eventSource.close());
  }, [showModal]);

  const onSend = () => {
    const params = new URLSearchParams();
    params.append('data', JSON.stringify({
      id: uuidv4(),
      username: username,
      message: state.currentMessage,
    }));
    params.append('topic', roomId);

    axios.post('http://vvasilescu.go.ro/.well-known/mercure', params, {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJtZXJjdXJlIjp7InB1Ymxpc2giOlsiKiJdLCJzdWJzY3JpYmUiOlsiaHR0cHM6Ly9leGFtcGxlLmNvbS9teS1wcml2YXRlLXRvcGljIiwie3NjaGVtZX06Ly97K2hvc3R9L2RlbW8vYm9va3Mve2lkfS5qc29ubGQiLCIvLndlbGwta25vd24vbWVyY3VyZS9zdWJzY3JpcHRpb25zey90b3BpY317L3N1YnNjcmliZXJ9Il0sInBheWxvYWQiOnsidXNlciI6Imh0dHBzOi8vZXhhbXBsZS5jb20vdXNlcnMvZHVuZ2xhcyIsInJlbW90ZUFkZHIiOiIxMjcuMC4wLjEifX19.z5YrkHwtkz3O_nOnhC_FP7_bmeISe3eykAkGbAl5K7c',
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });

    setState(s => ({ ...s, currentMessage: '' }));
  };

  return (
    <Modal show={showModal} onHide={closeModal}>
      <Modal.Header>
        <Modal.Title>Room {roomId}</Modal.Title>
        <Button type="button" onClick={closeModal}>Close</Button>
      </Modal.Header>
      <Modal.Body>
        <div style={{ height: 500, overflow: 'scroll' }}>
          <ol>
            {state.messages.map(message => (
              <li key={message.id}>
                <p>
                  <b style={{ color: username === message.username ? 'red' : 'black' }}>{message.username}: </b>{message.message}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </Modal.Body>
      <Modal.Footer style={{ justifyContent: 'center' }}>
        <div style={{ width: 370 }}>
          <input
            id="currentMessage"
            type="text"
            className="form-control"
            value={state.currentMessage}
            onChange={(event) => setState({ ...state, currentMessage: event.target.value })}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                onSend();
              }
            }}
          />
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => onSend()}
        >
          Send
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default Chat;
