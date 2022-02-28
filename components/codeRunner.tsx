import React, { PureComponent } from 'react';
import type { Editor } from 'codemirror';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import styles from '../styles/CodeRunner.module.css'
import * as lsc from 'lichenscript-web';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/xq-light.css';
import 'codemirror/mode/javascript/javascript';

interface MessageLine {
  type: 'info' | 'error',
  content: string,
}

interface PreviewState {
  lines: MessageLine[]
}

const theme = 'xq-light';

const defaultValue = `
function main() {
  print("Hello World");
  print("你好世界");
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

  dummyConsoleLog = (collector: MessageLine[]) => (content: string) => {
    collector.push({
      type: 'info',
      content,
    });
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

        const tmp: MessageLine[] = [];
        for (const errorLine of errors) {
          tmp.push({
            type: 'error',
            content: `${errorLine.line}:${errorLine.column}: ${errorLine.content}`,
          });
        }
        this.setState({
          lines: [...this.state.lines, ...tmp],
        });
      } else if (errorName.indexOf("TypeCheckError") >= 0) {
        const errors = e.errors || [];

        const tmp: MessageLine[] = [];
        for (const errorLine of errors) {
          tmp.push({
            type: 'error',
            content: `${errorLine.line}:${errorLine.column}: ${errorLine.content}`
          });
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
            {this.state.lines.map((lineContent, index) => {
              let clsName = styles.outputLine;
              if (lineContent.type === 'error') {
                clsName += ' ' + styles.errorOutputLine;
              }
              return <p className={clsName} key={`line-${index}`}>{lineContent.content}</p>
            })}
          </div>
        </div>
    )

  }

}

export default CodeRunner;
