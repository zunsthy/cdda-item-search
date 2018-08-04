import rItem from './item.mjs';
import { lang, requirements } from '../store.mjs';

const staticOr = `<span class="or"> or </span>`;

const createConditionRender = type => ([id, level]) => `
<span class="${type}">
  ${rItem(id, type)}
  <i>(${level})</i>
</span>
`;

const rGroup = (group, type) => {
  const r = createConditionRender(type);
  return group.map((item) => r(item, type)).join(staticOr);
};

export default (id) => {
  const requirement = requirements.get(id);

  let content;
  if (requirement.components) {
    content = requirement.components.map(group => `
<li>${rGroup(group, 'component')}</li>
    `);
  } else if (requirement.tools) {
    content = requirement.tools.map(group => `
<li>${rGroup(group, 'tool')}</li>
    `);
  }

  return `<ul class="requirement">${content}</ul>`;
};
