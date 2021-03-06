import { Editor } from 'codemirror';
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';

const PLAYGROUND_HASH_PREFIX = 'playground';

export function createPlaygroundURL(editor: Editor) {
  const text = editor.getValue();
  const urlObj = new URL(location.href);
  urlObj.hash = `#${PLAYGROUND_HASH_PREFIX}/${compressToEncodedURIComponent(text)}`;
  return urlObj;
}

export function decompressCodeFromURL() {
  const code = (location.hash || '').replace(`#${PLAYGROUND_HASH_PREFIX}/`, '');
  try {
    return decompressFromEncodedURIComponent(code);
  } catch {
    return null
  }
}