import React from 'react';
import { hot } from 'react-hot-loader/root';
import FileList from '@/client/views/FileList';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Switch>
        <Route component={FileList} />
      </Switch>
    </Router>
  );
}

export default hot(App);
