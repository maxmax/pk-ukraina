import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { stores } from './stores/root-store';
import Statement from './containers/Statement';
import VirtualizedContainer from './containers/VirtualizedContainer';
import VirtualizedTable from './containers/VirtualizedTable';

export default function App() {
  return (
    <Provider { ...stores }>
      <Routes>
        <Route path="/" element={<Statement />} />
        <Route path="/virtualized-window" element={<VirtualizedContainer />} />
        <Route path="/virtualized-table" element={<VirtualizedTable />} />
      </Routes>
    </Provider>
  );
}
