# Travis Mansook — Portfolio

A responsive personal portfolio with six featured projects and three interactive browser demos. This is a static website: no installation, build process, account, database, or API key is needed.

## Preview it

Open `index.html` in your browser. Keep all the other files and the `assets` folder alongside it. For the closest preview of the hosted version, use a local web server or Visual Studio Code's Live Server extension.

## Publish on GitHub Pages

See `GITHUB-PAGES-SETUP.md` for the step-by-step, browser-only setup steps. Create the public repository `travismansook.github.io`, upload these files at its top level, and select **Settings → Pages → Deploy from a branch → main → /(root) → Save**.

The intended GitHub Pages address is `https://travismansook.github.io/`. It becomes live only after you finish the GitHub setup.

## Make it yours

- `index.html`: your name, introduction, about section, project descriptions, links, and skills. Search for a project title or section heading to find it.
- `styles.css`: page colors, spacing, fonts, and responsive layouts. Colors are defined near the top under `:root`.
- `script.js`: project filters, section navigation indicator, and copyright year.
- `demos.js`: the working project demos and their input validation.
- `demos.css`: the demo dialog layouts.
- `assets/`: local fonts, font licenses, and the favicon. Fonts are included so visitors do not need Google Fonts requests.
- `.nojekyll`: tells GitHub Pages to serve these static files directly. The page also works if your browser upload does not include this hidden file.

To add a project, copy an existing `<article class="project-card">` in `index.html`, update its details and language, and adjust the total beside “All projects.”

No email address, employment, education, qualifications, or availability has been guessed. The skills were supplied by Travis; project descriptions were checked against his public GitHub code. Add your résumé or preferred professional contact link when you are ready.

## About the demos

These are JavaScript browser adaptations, clearly linked to the original code. The original C, Bash, and Python source does not run directly in the browser.

- **Sparse Matrix Addition**: editable 3 × 3 matrices, their sum, and CSR values, columns, and row pointers. The original C program reads and writes CSR files; this demo uses forms and shows the result on screen.
- **Word Frequency Counter**: counts exact nonblank input lines, preserving case and punctuation. The original Bash pipeline reads a file, includes blank lines, and its `awk` display truncates multiword lines. The adaptation displays full entries, skips blank lines, and sorts ties by JavaScript string order. Enter one word per line for the intended use.
- **Password Generator**: generates the requested number of letters, symbols, and digits and shuffles the result, using the original character sets. The adaptation uses browser randomness and enforces a 1–128 total length. The original Python exercise uses Python's `random` module.

All demo input stays in the visitor's browser. Copying a generated password uses the browser clipboard, with manual selection as a fallback. There are no trackers, external scripts, forms that send data, or paid services.

## Fonts

DM Sans and DM Mono are distributed under the SIL Open Font License. Their licenses are included in `assets/`.
