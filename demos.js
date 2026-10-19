(function () {
  'use strict';

  const LETTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const NUMBERS = '0123456789';
  const SYMBOLS = '!#$%&()*+';

  function validateMatrix(matrix) {
    if (!Array.isArray(matrix) || matrix.length !== 3 || matrix.some(row =>
      !Array.isArray(row) || row.length !== 3 || row.some(value =>
        !Number.isInteger(value) || value < -999 || value > 999))) {
      throw new Error('Enter a whole number from −999 to 999 in every cell.');
    }
  }

  function addMatrices(first, second) {
    validateMatrix(first);
    validateMatrix(second);
    return first.map((row, i) => row.map((value, j) => value + second[i][j]));
  }

  function denseToCSR(matrix) {
    if (!Array.isArray(matrix) || matrix.length !== 3 || matrix.some(row =>
      !Array.isArray(row) || row.length !== 3 || row.some(value => !Number.isInteger(value)))) {
      throw new Error('CSR conversion needs a 3 × 3 matrix of whole numbers.');
    }
    const values = [];
    const columns = [];
    const rowPointers = [0];
    matrix.forEach(row => {
      row.forEach((value, column) => {
        if (value !== 0) {
          values.push(value);
          columns.push(column);
        }
      });
      rowPointers.push(values.length);
    });
    return { values, columns, rowPointers };
  }

  function countEntries(text) {
    const counts = new Map();
    String(text).split(/\r?\n/).forEach(entry => {
      if (entry.trim()) counts.set(entry, (counts.get(entry) || 0) + 1);
    });
    return Array.from(counts, ([entry, count]) => ({ entry, count }))
      .sort((a, b) => b.count - a.count || (a.entry < b.entry ? -1 : a.entry > b.entry ? 1 : 0));
  }

  function validateCounts(letters, symbols, numbers) {
    const counts = [letters, symbols, numbers];
    if (counts.some(value => !Number.isInteger(value) || value < 0 || value > 128)) {
      throw new Error('Use a whole number from 0 to 128 for each character type.');
    }
    const total = letters + symbols + numbers;
    if (total < 1 || total > 128) {
      throw new Error('Choose between 1 and 128 characters in total.');
    }
    return total;
  }

  // Rejection sampling avoids bias from reducing an arbitrary random byte modulo n.
  function randomIndex(limit) {
    if (!globalThis.crypto || !globalThis.crypto.getRandomValues) {
      throw new Error('This browser cannot generate random values. Try a current browser.');
    }
    const byte = new Uint8Array(1);
    const cutoff = 256 - (256 % limit);
    do { globalThis.crypto.getRandomValues(byte); } while (byte[0] >= cutoff);
    return byte[0] % limit;
  }

  function generatePassword(letters, symbols, numbers) {
    validateCounts(letters, symbols, numbers);
    const result = [];
    [[LETTERS, letters], [SYMBOLS, symbols], [NUMBERS, numbers]].forEach(([alphabet, count]) => {
      for (let i = 0; i < count; i++) result.push(alphabet[randomIndex(alphabet.length)]);
    });
    for (let i = result.length - 1; i > 0; i--) {
      const j = randomIndex(i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result.join('');
  }

  globalThis.PortfolioDemos = Object.freeze({ addMatrices, denseToCSR, countEntries, generatePassword, validateCounts });
  if (typeof document === 'undefined') return;

  const projects = {
    matrix: {
      title: 'Sparse Matrix Addition',
      language: 'C',
      url: 'https://github.com/travismansook/Sparse-Matrix-Addition',
      description: 'Add two small matrices and see where their nonzero values combine. The original C project uses Compressed Sparse Row (CSR) storage; this browser adaptation shows the addition with a fixed 3 × 3 example.'
    },
    words: {
      title: 'Word Frequency Counter',
      language: 'Bash',
      url: 'https://github.com/travismansook/Word-Frequency-Counter',
      description: 'Try the counting idea behind the original Bash sort / uniq pipeline. Enter one word per line. Matching is case-sensitive, punctuation is kept, and blank lines are skipped. A line with several words is counted as one full entry.'
    },
    password: {
      title: 'Password Generator',
      language: 'Python',
      url: 'https://github.com/travismansook/Password-Generator',
      description: 'Choose how many letters, symbols, and numbers to include, then generate a shuffled result. This browser adaptation uses the same character sets as the Python project, with the browser’s random-value API.'
    }
  };

  let dialog;
  let returnFocus;
  let activeDemo;

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function makeButton(label, className, type) {
    const button = element('button', className, label);
    button.type = type || 'button';
    return button;
  }

  function ensureDialog() {
    if (dialog) return;
    dialog = element('dialog', 'demo-modal');
    dialog.id = 'demo-dialog';
    dialog.setAttribute('aria-labelledby', 'demo-title');
    dialog.setAttribute('aria-describedby', 'demo-description');
    const shell = element('div', 'demo-shell');
    const close = makeButton('×', 'demo-close');
    close.setAttribute('aria-label', 'Close project demo');
    close.addEventListener('click', () => dialog.close());
    shell.append(close);
    shell.append(element('p', 'demo-eyebrow', 'THE INTERACTIVE EDITION'));
    const title = element('h2', 'demo-title');
    title.id = 'demo-title';
    shell.append(title);
    const origin = element('p', 'demo-origin');
    origin.id = 'demo-origin';
    shell.append(origin);
    const description = element('p', 'demo-description');
    description.id = 'demo-description';
    shell.append(description);
    const content = element('div', 'demo-content');
    content.id = 'demo-content';
    shell.append(content);
    shell.append(element('p', 'demo-privacy', 'Runs here in your browser. Your entries are never uploaded.'));
    dialog.append(shell);
    document.body.append(dialog);
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('demo-is-open');
      if (returnFocus && returnFocus.isConnected) returnFocus.focus();
    });
  }

  function makeError() {
    const error = element('p', 'demo-error');
    error.setAttribute('role', 'alert');
    error.hidden = true;
    return error;
  }

  function showError(error, message, target) {
    error.textContent = message;
    error.hidden = false;
    if (target) {
      target.setAttribute('aria-invalid', 'true');
      target.focus();
    }
  }

  function clearError(error, form) {
    error.hidden = true;
    error.textContent = '';
    form.querySelectorAll('[aria-invalid]').forEach(input => input.removeAttribute('aria-invalid'));
  }

  function integerValue(input) {
    const raw = input.value.trim();
    return /^-?\d+$/.test(raw) ? Number(raw) : NaN;
  }

  function makeMatrix(name, values) {
    const group = element('fieldset', 'demo-matrix-fieldset');
    group.append(element('legend', 'demo-field-label', 'Matrix ' + name));
    const grid = element('div', 'demo-matrix-grid');
    const inputs = values.map((row, rowIndex) => row.map((value, columnIndex) => {
      const input = element('input', 'demo-cell');
      input.type = 'number';
      input.value = value;
      input.min = '-999';
      input.max = '999';
      input.step = '1';
      input.required = true;
      input.setAttribute('aria-label', 'Matrix ' + name + ', row ' + (rowIndex + 1) + ', column ' + (columnIndex + 1));
      grid.append(input);
      return input;
    }));
    group.append(grid);
    return { group, inputs };
  }

  function buildMatrix(content) {
    const form = element('form', 'demo-form');
    form.noValidate = true;
    const inputs = element('div', 'demo-matrix-inputs');
    const first = makeMatrix('A', [[0, 5, 0], [0, 0, 2], [3, 0, 0]]);
    const second = makeMatrix('B', [[1, -5, 0], [0, 0, 4], [0, 7, 0]]);
    inputs.append(first.group, element('span', 'demo-plus', '+'), second.group);
    form.append(inputs);
    form.append(element('p', 'demo-hint', 'Use whole numbers from −999 to 999. Zero values represent empty positions.'));
    form.append(makeButton('Add matrices', 'demo-button', 'submit'));
    const error = makeError();
    form.append(error);
    const result = element('div', 'demo-result');
    result.setAttribute('aria-live', 'polite');
    result.append(element('p', 'demo-placeholder', 'Your matrix sum will appear here.'));
    form.append(result);
    form.addEventListener('submit', event => {
      event.preventDefault();
      clearError(error, form);
      const allInputs = first.inputs.flat().concat(second.inputs.flat());
      const invalid = allInputs.find(input => {
        const value = integerValue(input);
        return !Number.isInteger(value) || value < -999 || value > 999;
      });
      if (invalid) {
        showError(error, 'Enter a whole number from −999 to 999 in every cell.', invalid);
        return;
      }
      const sum = addMatrices(first.inputs.map(row => row.map(integerValue)), second.inputs.map(row => row.map(integerValue)));
      result.replaceChildren();
      result.append(element('h3', 'demo-result-title', 'A + B'));
      const table = element('table', 'demo-matrix-output');
      table.setAttribute('aria-label', 'Matrix addition result');
      const tbody = element('tbody');
      sum.forEach(row => {
        const tr = element('tr');
        row.forEach(value => tr.append(element('td', value === 0 ? 'demo-zero' : 'demo-nonzero', String(value))));
        tbody.append(tr);
      });
      table.append(tbody);
      result.append(table);
      const nonzero = sum.flat().filter(value => value !== 0).length;
      result.append(element('p', 'demo-summary', nonzero + ' nonzero ' + (nonzero === 1 ? 'value' : 'values') + ' · ' + (9 - nonzero) + ' zero ' + (9 - nonzero === 1 ? 'value' : 'values')));
      const csr = denseToCSR(sum);
      const storage = element('div', 'demo-csr');
      storage.append(element('h3', 'demo-result-title', 'Compressed Sparse Row (CSR)'));
      const arrays = element('dl', 'demo-csr-arrays');
      [['Values', csr.values], ['Columns', csr.columns], ['Row pointers', csr.rowPointers]].forEach(([label, values]) => {
        arrays.append(element('dt', '', label), element('dd', '', '[' + values.join(', ') + ']'));
      });
      storage.append(arrays, element('p', 'demo-hint', 'CSR stores only nonzero values. Columns count from 0. Row pointers mark each row’s starting position in the values array; the final pointer is the total stored values.'));
      result.append(storage);
    });
    content.append(form);
  }

  function buildWords(content) {
    const form = element('form', 'demo-form');
    form.noValidate = true;
    const label = element('label', 'demo-field-label', 'One word per line');
    label.htmlFor = 'demo-words-input';
    const textarea = element('textarea', 'demo-textarea');
    textarea.id = 'demo-words-input';
    textarea.rows = 7;
    textarea.maxLength = 30000;
    textarea.spellcheck = false;
    textarea.value = 'code\nlearn\nbuild\ncode\nbuild\ncode\nBuild';
    const hint = element('p', 'demo-hint', 'Try changing “Build” to “build” to see how case changes the result. Maximum 30,000 characters.');
    hint.id = 'demo-words-hint';
    textarea.setAttribute('aria-describedby', hint.id);
    form.append(label, textarea, hint, makeButton('Count entries', 'demo-button', 'submit'));
    const error = makeError();
    form.append(error);
    const result = element('div', 'demo-result');
    result.setAttribute('aria-live', 'polite');
    result.append(element('p', 'demo-placeholder', 'Your frequency report will appear here.'));
    form.append(result);
    form.addEventListener('submit', event => {
      event.preventDefault();
      clearError(error, form);
      if (textarea.value.length > 30000) {
        showError(error, 'Keep the text to 30,000 characters or fewer.', textarea);
        return;
      }
      const entries = countEntries(textarea.value);
      if (!entries.length) {
        showError(error, 'Enter at least one word or nonblank line to count.', textarea);
        return;
      }
      result.replaceChildren();
      const total = entries.reduce((sum, entry) => sum + entry.count, 0);
      result.append(element('h3', 'demo-result-title', 'Frequency report'));
      result.append(element('p', 'demo-summary', total + ' total ' + (total === 1 ? 'entry' : 'entries') + ' · ' + entries.length + ' unique'));
      const scroll = element('div', 'demo-table-scroll');
      scroll.tabIndex = 0;
      scroll.setAttribute('role', 'region');
      scroll.setAttribute('aria-label', 'Frequency results, scroll to see all entries');
      const table = element('table', 'demo-frequency-table');
      const head = element('thead');
      const headers = element('tr');
      ['Entry', 'Count'].forEach(text => {
        const th = element('th', '', text);
        th.scope = 'col';
        headers.append(th);
      });
      head.append(headers);
      const body = element('tbody');
      entries.forEach(({ entry, count }) => {
        const row = element('tr');
        row.append(element('td', 'demo-entry', entry), element('td', 'demo-count', String(count)));
        body.append(row);
      });
      table.append(head, body);
      scroll.append(table);
      result.append(scroll);
    });
    content.append(form);
  }

  function buildPassword(content) {
    const form = element('form', 'demo-form');
    form.noValidate = true;
    const counts = element('div', 'demo-count-fields');
    const fields = [['Letters', 'A–Z, a–z', 10], ['Symbols', SYMBOLS, 3], ['Numbers', '0–9', 3]].map(([labelText, hintText, value], index) => {
      const field = element('div', 'demo-count-field');
      const label = element('label', 'demo-field-label', labelText);
      const input = element('input', 'demo-number');
      input.id = 'demo-count-' + index;
      label.htmlFor = input.id;
      input.type = 'number';
      input.value = value;
      input.min = '0';
      input.max = '128';
      input.step = '1';
      input.required = true;
      const hint = element('p', 'demo-character-set', hintText);
      hint.id = input.id + '-hint';
      input.setAttribute('aria-describedby', hint.id);
      field.append(label, input, hint);
      counts.append(field);
      return input;
    });
    form.append(counts, element('p', 'demo-hint', 'Choose 1–128 characters in total. Each result is shuffled.'));
    form.append(makeButton('Generate password', 'demo-button', 'submit'));
    const error = makeError();
    form.append(error);
    const result = element('div', 'demo-result');
    result.setAttribute('aria-live', 'polite');
    result.append(element('p', 'demo-placeholder', 'Your generated password will appear here.'));
    form.append(result);
    form.addEventListener('submit', event => {
      event.preventDefault();
      clearError(error, form);
      const values = fields.map(integerValue);
      let password;
      try { password = generatePassword(...values); }
      catch (problem) {
        const invalid = fields.find(input => !Number.isInteger(integerValue(input)) || integerValue(input) < 0 || integerValue(input) > 128);
        showError(error, problem.message, invalid || fields[0]);
        return;
      }
      result.replaceChildren();
      const label = element('label', 'demo-result-title', 'Generated password');
      label.htmlFor = 'demo-password-output';
      const output = element('textarea', 'demo-password-output');
      output.id = 'demo-password-output';
      output.readOnly = true;
      output.spellcheck = false;
      output.rows = password.length > 48 ? 3 : 2;
      output.value = password;
      const copy = makeButton('Copy password', 'demo-button demo-button-secondary');
      const status = element('p', 'demo-copy-status', password.length + ' characters generated.');
      status.setAttribute('role', 'status');
      copy.addEventListener('click', async () => {
        try {
          if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('Clipboard unavailable');
          await navigator.clipboard.writeText(output.value);
          status.textContent = 'Copied to clipboard.';
        } catch (_) {
          output.focus();
          output.select();
          status.textContent = 'Password selected. Press Ctrl+C or ⌘C to copy.';
        }
      });
      result.append(label, output, copy, status);
    });
    content.append(form);
  }

  function openDemo(name, trigger) {
    if (!projects[name]) return;
    ensureDialog();
    returnFocus = trigger || document.activeElement;
    activeDemo = name;
    const project = projects[name];
    dialog.querySelector('#demo-title').textContent = project.title;
    const origin = dialog.querySelector('#demo-origin');
    const source = element('a', '', 'original ' + project.language + ' on GitHub');
    source.href = project.url;
    source.target = '_blank';
    source.rel = 'noopener noreferrer';
    source.setAttribute('aria-label', 'View the original ' + project.title + ' ' + project.language + ' project on GitHub (opens in a new tab)');
    origin.replaceChildren(document.createTextNode('Browser adaptation · '), source);
    dialog.querySelector('#demo-description').textContent = project.description;
    const content = dialog.querySelector('#demo-content');
    content.replaceChildren();
    ({ matrix: buildMatrix, words: buildWords, password: buildPassword })[name](content);
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('demo-is-open');
    dialog.querySelector('.demo-close').focus();
  }

  document.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    const trigger = event.target.closest('[data-demo]');
    if (!trigger || !projects[trigger.dataset.demo]) return;
    event.preventDefault();
    openDemo(trigger.dataset.demo, trigger);
  });
})();
