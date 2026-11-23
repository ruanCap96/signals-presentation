# Angular Signals — interactive sessions

Browser slide sessions for the Angular Signals knowledge-sharing series, with live,
editable demos and a standalone signals lab.

Part 1 follows [Angular Signals Essentials](https://angular.dev/essentials/signals):
create/read/change state, derive values with `computed()`, and use signals in components.
The RxJS comparison and "Test your knowledge" object-mutation quiz are short practical extras; deeper
details stay in presenter notes or Part 2.

| Route     | What                                                         |
| --------- | ------------------------------------------------------------ |
| `/part-1` | What is it, and what can we do with it? (10 slides, ~23 min) |
| `/part-2` | Draft: RxJS interop, derived state, form dialog, tools       |
| `/lab`    | Free-form TypeScript playground (runs in a Web Worker)       |

## Run it

```bash
npm ci
npm start        # http://127.0.0.1:4300
```

Tested with Node 24 and npm 11.

## Share it

- [Read-along](https://ruancap96.github.io/signals-presentation/read-along.html) — all Part 1 examples, explanations, and presenter gotchas, with a print-to-PDF button.
- [Interactive slides](https://ruancap96.github.io/signals-presentation/) — live demos and the signals lab.
- [Source repository](https://github.com/ruanCap96/signals-presentation)

The read-along is also available locally at `http://127.0.0.1:4300/read-along.html`.
Use **Print / save as PDF** in a browser to save the ten-slide, landscape handout.

GitHub Pages deploys from `main` with `.github/workflows/deploy-pages.yml`; the workflow runs tests, builds with the repository base path, and publishes the Angular browser output.

## Present it

| Key            | Action                     |
| -------------- | -------------------------- |
| `→` / `Space`  | Next step, then next slide |
| `←`            | Previous slide             |
| `Home` / `End` | First / last slide         |
| `N`            | Toggle presenter notes     |

Most slides build up in steps; the pink **Next step** button in the footer does the same as `→`.
**Reset demo** re-creates the current slide (back to step 1); **Restart** goes back to slide 1.
Slide state also resets when you leave a slide.

## Live code (Part 1: signal and computed slides)

The code on the left _is_ the demo: edit it and the LIVE panel on the right
updates as you type (300 ms debounce). Try `signal(5)`, `n + 5` or `* 3`.

- `signal` and `computed` are available without imports.
- If the code has an error, it is shown and LIVE keeps the last working version.
- **Reset code** restores the original snippet.
- `for`/`while` loops are blocked (they would freeze the tab). Use the lab for those.
- Code runs in the page: trusted code only, not a security sandbox.

## Lab (`/lab`)

Pick an example, edit, then **Run** (or Ctrl/⌘ + Enter). `signal`, `computed`
and `log` are available. Code runs in a fresh Web Worker that is stopped after
three seconds, so infinite loops can't freeze the page.

## Project layout

```
src/app/
  shell/            session shell (navigation, notes, reset) + Slide/Session types
  shared/           code highlighting, live code editor, definitions, show pipe
  sessions/part-1/     part-1.session.ts (order, minutes, notes) + slides/<id>/<id>.slide.ts|html
  sessions/part-2/     draft session, same layout
  lab/              worker playground, examples, lab page
  app.routes.ts     lazy routes for sessions and lab
```

To add a slide: create `slides/<id>/<id>.slide.ts` + `<id>.slide.html` (standalone, `templateUrl`, `host: { class: 'slide-body' }`)
and add it to the session file. To add a session: copy `sessions/part-2` and add a route.

```bash
npm test         # Vitest unit tests
npm run build
```
