import { computed, signal } from '@angular/core';
import { transform } from 'sucrase';

addEventListener('message', ({ data }: MessageEvent<string>) => {
  const lines: string[] = [];
  const log = (...values: unknown[]): void => {
    if (lines.length >= 100) throw new Error('Output limit reached (100 log calls).');
    lines.push(
      values
        .map((value) => (typeof value === 'string' ? value : String(JSON.stringify(value))))
        .join(' '),
    );
  };

  try {
    const { code } = transform(data, { transforms: ['typescript'], filePath: 'playground.ts' });
    const run = new Function('signal', 'computed', 'log', `"use strict";\n${code}`);
    run(signal, computed, log);
    postMessage({ lines, error: null });
  } catch (error) {
    postMessage({ lines, error: error instanceof Error ? error.message : String(error) });
  }
});
