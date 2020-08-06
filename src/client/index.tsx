import React from 'react';
import ReactDOM from 'react-dom';
import App from '@/client/App';
import { removeClass, removeElement, setTagTitle } from '@/client/utils/domLib';

(module as any).hot?.accept();

// debug
if (isDev) {
  // // why-did-you-render
  // const whyDidYouRender = require('@welldone-software/why-did-you-render');
  // whyDidYouRender(React, { include: [/^./], collapseGroups: true }); // rewrite you want here
}

removeClass(document.getElementById('body'), 'body-loading');
removeElement(document.getElementById('sk-cube-grid'));
setTagTitle('File Share');
// mount react-dom
ReactDOM.render(<App />, document.getElementById('root'));
