import React from 'react';
import { Provider } from 'mobx-react';
import { stores } from './stores/root-store';
import Statement from './containers/Statement';

export default function App() {
  return (
    <Provider { ...stores }>
			<Statement />
    </Provider>
  );
}
