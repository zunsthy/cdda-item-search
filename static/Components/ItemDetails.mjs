import { lang } from '../store.mjs';

export default (item) => {
  const row = (name, key, r) => {
    const value = item[key];
    if (!value) return null;
    else if (Array.isArray(value) && !value.length) return null;

    return `<dt>${name}</dt><dd>${r ? r(value) : value}</dd>`;
  };

  const content = document.createElement('dl');
  content.innerHTML = [
    row('ID', 'id'),
    row('Name', 'name'),
    row('Name', 'name', name => lang.has(name) ? lang.get(name) : name),
    row('Weight', 'weight'),
    row('Volume', 'volume'),
    row('To Hit', 'to_hid'),
    row('Bash', 'bashing'),
    row('Cut', 'cutting'),
    row('Material', 'material'),
    row('Use Action', 'use_action'),
    row('Flag', 'flag'),
    row('Techniques', 'techniques'),
    row('Qualities', 'qualities'),
  ].filter(Boolean).join('');

  const container = document.createElement('div');
  container.classList.add('item-block');
  container.appendChild(content);

  return container;
};
