import React from 'react';
import './App.css';

import { createFlow } from 'react-flows';

const MessagesFlowComponent = createFlow<{ messages: string[] }>(props => async ({ render }) => {
  const { messages } = props;

  for (let i = 0; i < messages.length; i++) {
    await render(MessageView, { message: messages[i], isLast: i === messages.length - 1 });
  }
});

function MessageView(props: { message: string, isLast: boolean, finish: () => void }) {
  const { message, isLast, finish } = props;

  console.log(props)

  return (
    <div>
      <p>{message}</p>
      {!isLast && <button onClick={finish}>Next</button>}
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <MessagesFlowComponent
          messages={['Hello!', 'This component shows messages on separate slides, one by one.', 'This is the final slide!']}
        />
      </header>
    </div>
  );
}

export default App;
