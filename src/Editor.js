import React, { useState, useEffect } from 'react';
import { basicSetup } from 'codemirror';
import CodeMirror from '@uiw/react-codemirror';
import { langs } from '@uiw/codemirror-extensions-langs';
import { getDocument } from './socket';
import { collabExtension } from './collabExtension';

const defaultEditor = (
  <div style={{
    height: '500px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#282c34',
    color: '#e06c75'
  }}>
    <h4>
      Connect to edit the document...
    </h4>
  </div>
);

const Editor = () => {
  const [editor, setEditor] = useState(defaultEditor);

  useEffect(() => {
    getDocument().then(({ version, doc }) => {
      setEditor(
        <CodeMirror
          height='500px'
          theme='dark'
          value={doc}
          extensions={[basicSetup, langs.javascript(), collabExtension(version)]}
        />
      );
    });
  }, []);

  return editor;
};

export default Editor;