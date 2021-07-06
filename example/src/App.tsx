import React, { useCallback, useRef } from 'react';
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

  return (
    <div>
      <p>{message}</p>
      {!isLast && <button onClick={finish}>Next</button>}
    </div>
  );
}

const InputFlowComponent = createFlow(() => async ({ render }) => {
  const input = await render(InputView);

  render(OutputView, { text: input });

  return input;
});

function InputView(props: { finish: (input: string) => void}) {
  const { finish } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = useCallback(() => {
    finish(inputRef.current?.value ?? '');
  }, [finish]);

  return (
    <div>
      <div>This component takes your input and shows it on the next slide.</div>
      <input ref={inputRef} type='text'/>
      <button onClick={onSubmit}>Submit</button>
    </div>
  );
}

function OutputView(props: { text: string }) {
  return (
    <div>
      You said: {props.text}
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <h1>React Flows examples</h1>

      <div className="flows-group">
        <div className="flow">
          <MessagesFlowComponent
            messages={[
              'Hello!',
              'This component shows messages on separate slides, one by one.',
              'This is the final slide!'
            ]}
          />
        </div>

        <div className="flow">
          <InputFlowComponent onFinish={input => console.log('User said', input)} />
        </div>
      </div>
    </div>
  );
}

export default App;
