import React from 'react';
import './App.css';
import DndContainer from './components/DndContainer';
import { RecoilRoot, atom, selector, useRecoilState, useRecoilValue } from 'recoil';

function App() {
  return (
    <div>
      <DndContainer />
    </div>
  );
}

export default App;
