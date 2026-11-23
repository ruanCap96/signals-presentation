import { highlight } from './code-block';

describe('highlight', () => {
  it('highlights code tokens', () => {
    const [line] = highlight("count = signal(0); // 'hi'");
    expect(line.find((t) => t.text === 'signal')?.kind).toBe('api');
    expect(line.at(-1)?.kind).toBe('comment');
  });

  it('highlights function declarations as keywords', () => {
    const [line] = highlight('function increment() {');
    expect(line[0]).toEqual({ kind: 'keyword', text: 'function' });
  });
});
