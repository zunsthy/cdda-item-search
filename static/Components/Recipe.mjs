import rItem from './Item.mjs';

const normalizeList = arr => {
  if (typeof arr[0] === 'string') return [arr];
  return arr;
};

const rCondition = (name, type) => {
  if ([
    'book',
    'tool',
    'using',
    'component',
  ].indexOf(type) !== -1) {
    return rItem(name, type);
  } else {
    return `<a class="search-link" data-type="${type}">${name}</a>`;
  }
};

const createConditionRender = type => ([name, level]) => `
<span class="${type}">
  ${rCondition(name, type)}
  ${level !== undefined ? `<i>(${level})</i>` : ''}
</span>
`;
const createListRender = (r, sp) => list => `
<span>${list.map(r).join(sp)}</span>
`;
const staticOr = `<span class="or"> or </span>`;
const staticAnd = `<span class="and"> and </span>`;

const rSkill = createConditionRender('skill');
const rQualityNormal = createConditionRender('qualitity');
const rQuality = ({ id, level }) => rQualityNormal([id, level]);
const rBook = createConditionRender('book');
const rTool = createConditionRender('tool');
const rUsing = createConditionRender('using');
const rComponent = createConditionRender('component');

const rSkillList = createListRender(rSkill, staticAnd);
const rQualityList = createListRender(rQuality, staticAnd);
const rBookList = createListRender(rBook, staticOr);
const rToolList = createListRender(rTool, staticOr);
const rUsingList = createListRender(rUsing, staticOr);
const rComponentList = createListRender(rComponent, staticOr);

const rTools = (tools) => `
<ul class="tools">
  ${tools.map(list => `<li>${rToolList(list)}</li>`).join('')}
</ul>
`;
const rComponents = (components) => `
<ul clas="components">
  ${components.map(list => `<li>${rComponentList(list)}</li>`).join('')}
</ul>
`;

export default (recipe) => {
  const title = document.createElement('h4');
  title.appendChild(document.createTextNode(recipe.result));

  const row = (name, key, r) => {
    const value = recipe[key];
    if (!value) return null;
    else if (Array.isArray(value) && !value.length) return null;

    return `<dt>${name}</dt><dd>${r ? r(value) : value}</dd>`;
  };

  const content = document.createElement('dl');
  content.innerHTML = [
    row('Category', 'category', cate => cate.split('_')),
    row('SubCategory', 'subcategory', cate => cate.split('_')),
    row('Time', 'time'),
    row('Batch Time', 'batch_time_factors'),
    `<dt>Skill</dt><dd>${rSkill([recipe.skill_used, recipe.difficulty])}</dd>`,
    row('Skill Required', 'skills_required', v => rSkillList(normalizeList(v))),
    row('Book', 'book_learn', rBookList),
    row('Auto Learn', 'autolearn'),
    row('Qualities', 'qualities', rQualityList),
    row('Tools', 'tools', rTools),
    row('Using', 'using', rUsingList),
    row('Components', 'components', rComponents),
  ].filter(Boolean).join('');

  const container = document.createElement('section');
  container.appendChild(title);
  container.appendChild(content);

  return container;
};

