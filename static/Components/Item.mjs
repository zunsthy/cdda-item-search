import rRequirement from './Requirement.mjs';
import { lang, items, requirements } from '../store.mjs';

export default (id, type) => {
  if (items.has(id)) {
    const item = items.get(id);
    const msg = lang.get(item.name);

    return `
<a
  class="search-link"
  data-type="item"
  data-origin="${type}"
  data-id="${id}"
  data-name="${item.name}"
>${msg || item.name}</a>
    `;
  } else if (requirements.has(id)) {
    if (type === 'tool') console.log(rRequirement(id));
    return rRequirement(id);
  } else {
    return `
<a
  class="search-link"
  data-type="item"
  data-origin="${type}"
  data-id="${id}"
>${id}</a>
    `;
  }
};
