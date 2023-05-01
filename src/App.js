import React, { useEffect, useState } from 'react';
import Editor from './Editor';
import { socket } from './socket';

const App = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  //#region Connect & Disconnect
  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);
  //#endregion

  return (
    <div>
      <Editor />
      <div style={{ padding: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem' }}>
          <button onClick={() => socket.connect()}>Connect</button>
          <button onClick={() => socket.disconnect()}>Disconnect</button>
        </div>
        <div style={{ padding: '0.5rem', paddingTop: 0 }}>
          {
            isConnected ? 'Connected' : 'Disconnected'
          }
        </div>
      </div>
    </div>
  );
}

export default App;