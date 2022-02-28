import React, { PureComponent } from 'react';
import type { Editor } from 'codemirror';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import styles from '../styles/CodeRunner.module.css'
import * as lsc from 'lichenscript-web';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/xq-light.css';
import 'codemirror/mode/javascript/javascript';

interface PreviewState {
  lines: string[]
}

const theme = 'xq-light';

const defaultValue = `
function main() {
  print("Hello World");
}
`;

class CodeRunner extends PureComponent<{}, PreviewState> {

  private __editor: Editor;

  constructor(props: {}) {
    super(props);
    this.state = {
      lines: []
    };
  }

  __onEditorAttatched = (e: Editor) => {
    this.__editor = e;
    this.__editor.setValue(defaultValue);
  }

  dummyConsoleLog = (collector: string[]) => (content: string) => {
    collector.push(content);
  }

  onRunClicked = () => {
    const content = this.__editor.getValue();
    const originalLog = console.log;
    try {
      const result = lsc.compile(content);
      const tmp = [];
      console.log = this.dummyConsoleLog(tmp);
      const fun = new Function(result);
      fun();

      this.setState({
        lines: [...this.state.lines, ...tmp],
      });
    } catch (e) {
      const errorName = e.toString();
      if (errorName.indexOf("ParseError") >= 0) {
        const errors = e.errors || [];

        const tmp = [];
        for (const errorLine of errors) {
          tmp.push(`${errorLine.line}:${errorLine.column}: ${errorLine.content}`);
        }
        this.setState({
          lines: [...this.state.lines, ...tmp],
        });
      } else if (errorName.indexOf("TypeCheckError") >= 0) {
        const errors = e.errors || [];

        const tmp = [];
        for (const errorLine of errors) {
          tmp.push(`${errorLine.line}:${errorLine.column}: ${errorLine.content}`);
        }
        this.setState({
          lines: [...this.state.lines, ...tmp],
        });
      } else {
        this.setState({
          lines: [...this.state.lines, errorName],
        });
      }
    } finally {
      console.log = originalLog;
    }
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
              The code is compiled and eval in your browser.
            </p>
            <button
              className={styles.runButton}
              onClick={this.onRunClicked}
            >
              Run
            </button>
          </div>
          <div>
            {this.state.lines.map((lineContent, index) =>
              <p className={styles.outputLine} key={`line-${index}`}>{lineContent}</p>
            )}
          </div>
        </div>
    )

  }

}

export default CodeRunner;
