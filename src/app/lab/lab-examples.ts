export interface LabExample {
  id: string;
  label: string;
  code: string;
}

export const labExamples: readonly LabExample[] = [
  {
    id: 'signal',
    label: 'signal: set & update',
    code: `const count = signal(0);
log('Initial:', count());

count.set(5);
log('After set:', count());

count.update(n => n + 1);
log('After update:', count());`,
  },
  {
    id: 'computed',
    label: 'computed: lazy & cached',
    code: `const count = signal(1);
let runs = 0;
const doubled = computed(() => {
  runs++;
  return count() * 2;
});

log('Not read yet, runs:', runs);
log(doubled(), doubled(), 'runs:', runs);

count.set(4);
log(doubled(), 'runs:', runs);`,
  },
  {
    id: 'mutate',
    label: 'gotcha: mutate vs replace',
    code: `const items = signal<string[]>([]);
const itemCount = computed(() => items().length);
log('Start:', itemCount());

items().push('Passport');
log('After push:', itemCount(), 'but array has', items().length);

items.update(list => [...list, 'Visa']);
log('After update:', itemCount());`,
  },
  {
    id: 'loop',
    label: 'loops run off the UI thread',
    code: `// Runs in a Web Worker: an endless loop is stopped
// after 3 seconds instead of freezing the page.
let total = 0;
for (let i = 1; i <= 1_000_000; i++) total += i;
log('Sum:', total);

// while (true) {}`,
  },
];
