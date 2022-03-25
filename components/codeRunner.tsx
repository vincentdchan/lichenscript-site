import React, { PureComponent } from 'react';
import type { Editor } from 'codemirror';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import styles from '../styles/CodeRunner.module.css'
import * as lsc from 'lichenscript-web';
import { createPlaygroundURL, decompressCodeFromURL } from '../utils/playgroundURL';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/xq-light.css';
import 'codemirror/mode/javascript/javascript';

interface MessageLine {
  type: 'info' | 'error',
  content: string,
}

interface PreviewState {
  lines: MessageLine[];
  showToast: boolean;
  toastContent: string;
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
  private __lastShareURL: string = '';
  private __lastTimer: NodeJS.Timeout = null;
  private __containerRef: React.RefObject<HTMLDivElement> = React.createRef();

  constructor(props: {}) {
    super(props);
    this.state = {
      lines: [],
      showToast: false,
      toastContent: '',
    };
  }

  __onEditorAttatched = (e: Editor) => {
    const initialContent = decompressCodeFromURL() || defaultValue;
    this.__editor = e;
    this.__editor.setValue(initialContent);
  }

  componentDidMount(): void {
    const playgroundURL = decompressCodeFromURL();
    if (!playgroundURL) {
      return;
    }

    if (typeof window != 'undefined' && window.scroll) {
      const y = this.__containerRef.current.getBoundingClientRect().top + window.scrollY;
      window.scroll({
        top: y,
        behavior: 'smooth'
      });
    }
  }

  dummyConsoleLog = (collector: MessageLine[]) => (content: string) => {
    collector.push({
      type: 'info',
      content,
    });
  }

  onRunClicked = () => {
    if (typeof window !== 'undefined' && typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'run_code');
    }
    const content = this.__editor.getValue();
    const originalLog = console.log;
    try {
      const compileResult = lsc.compile(content);
      const tmp = [];
      console.log = this.dummyConsoleLog(tmp);
      compileResult.execute([]);

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
        console.error(e);
        this.setState({
          lines: [...this.state.lines, errorName],
        });
      }
    } finally {
      console.log = originalLog;
    }
  }

  onShareClicked = async () => {
    if (typeof window !== 'undefined' && typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'share_code');
    }

    const urlObj = createPlaygroundURL(this.__editor);
    const urlStr = urlObj.toString();
    const isSameURL = urlStr === this.__lastShareURL;

    try {
      if (!isSameURL) {
        location.hash = urlObj.hash;
        await navigator.clipboard.writeText(urlStr);
      }
      this.__lastShareURL = urlStr;
      clearTimeout(this.__lastTimer);
      this.setState({
        showToast: true,
        toastContent: 'URL copied to clipboard',
      }, () => {
        this.__lastTimer = setTimeout(() => {
          this.setState({
            showToast: false
          });
        }, 2000);
      })
    } catch {
      // do nothing.
    }
  }

  render() {
    const { lines, showToast, toastContent } = this.state;
    return (
      <>
        <div className={styles.codeRunner} ref={this.__containerRef}>
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
            className={styles.shareButton}
            onClick={this.onShareClicked}
            disabled={this.__editor && !this.__editor.getValue().length}
          >
            Share
          </button>
          <button
            className={styles.runButton}
            onClick={this.onRunClicked}
          >
            Run
          </button>
        </div>
        <div>
          {lines.map((lineContent, index) => {
            let clsName = styles.outputLine;
            if (lineContent.type === 'error') {
              clsName += ' ' + styles.errorOutputLine;
            }
            return <p className={clsName} key={`line-${index}`}>{lineContent.content}</p>
          })}
        </div>
        
        {showToast && <div className={styles.copyToast}>
          {toastContent}
        </div>}
      </>
    )

  }

}

export default CodeRunner;
