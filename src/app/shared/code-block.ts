import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

type TokenKind = 'comment' | 'string' | 'keyword' | 'api' | 'plain';
interface Token {
  kind: TokenKind;
  text: string;
}

const KEYWORDS = new Set([
  'const',
  'let',
  'function',
  'readonly',
  'private',
  'new',
  'void',
  'return',
]);
const APIS = new Set([
  'signal',
  'computed',
  'effect',
  'input',
  'asReadonly',
  'toSignal',
  'linkedSignal',
  'httpResource',
  'set',
  'update',
  'next',
  'subscribe',
  'asObservable',
  'combineLatest',
  'map',
  'pipe',
  'select',
  'startWith',
  'async',
  '@if',
]);

const TOKEN = /(\/\/.*$)|('[^']*'|"[^"]*")|(@?[A-Za-z_$][\w$]*)/g;

export function highlight(code: string): Token[][] {
  return code.split('\n').map((line) => {
    const tokens: Token[] = [];
    let last = 0;
    for (const match of line.matchAll(TOKEN)) {
      const index = match.index ?? 0;
      if (index > last) tokens.push({ kind: 'plain', text: line.slice(last, index) });
      const [text, comment, str, word] = match;
      let kind: TokenKind = 'plain';
      if (comment) kind = 'comment';
      else if (str) kind = 'string';
      else if (word && KEYWORDS.has(word)) kind = 'keyword';
      else if (word && APIS.has(word)) kind = 'api';
      tokens.push({ kind, text });
      last = index + text.length;
    }
    if (last < line.length) tokens.push({ kind: 'plain', text: line.slice(last) });
    return tokens;
  });
}

@Component({
  selector: 'app-code',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './code-block.html',
})
export class CodeBlock {
  readonly code = input.required<string>();
  readonly file = input<string>();
  protected readonly lines = computed(() => highlight(this.code()));
}
