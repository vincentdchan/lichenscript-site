import React, { PureComponent } from 'react';
import type { Editor } from 'codemirror';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/xq-light.css';
import 'codemirror/mode/javascript/javascript';

interface PreviewState {
    exampleKey: string;
    content: string;
    errorMsg: string | null;
}

const theme = 'xq-light';

class CodeRunner extends PureComponent<{}, PreviewState> {

  private __editor: Editor;

  __onEditorAttatched = (e: Editor) => {
    this.__editor = e;
    this.__editor.setValue(`
    function main() {
      print("Hello World");
    }
    `);
  }

  render() {
    return (
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
    )

  }

}

export default CodeRunner;
