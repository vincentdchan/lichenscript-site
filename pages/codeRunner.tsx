import React, { PureComponent } from 'react';
import type { Editor } from 'codemirror';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import styles from '../styles/CodeRunner.module.css'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/xq-light.css';
import 'codemirror/mode/javascript/javascript';

interface PreviewState {
    exampleKey: string;
    content: string;
    errorMsg: string | null;
}

const theme = 'xq-light';

const defaultValue = `
function main() {
  print("Hello World");
}
`;

class CodeRunner extends PureComponent<{}, PreviewState> {

  private __editor: Editor;

  __onEditorAttatched = (e: Editor) => {
    this.__editor = e;
    this.__editor.setValue(defaultValue);
  }

  render() {
    return (
        <div className={styles.codeRunnerContainer}>
          <h2>Playground</h2>
          <div className={styles.codeRunner}>
            <CodeMirror
              editorDidMount={this.__onEditorAttatched}
              options={{
                mode: 'javascript',
                theme,
                lineNumbers: true,
              }}
              onChange={(editor, data, value) => {
                //this.computeReverse(value);
              }}
            />
          </div>
          <div className={styles.runButtonContainer}>
            <p style={{ flex: '1', color: 'grey', fontSize: '14px' }}>
              The code is compiled in our server and eval in your browser.
            </p>
            <button className={styles.runButton}>Run</button>
          </div>
        </div>
    )

  }

}

export default CodeRunner;
