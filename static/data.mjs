import { lang, recipes, items, requirements } from './store.mjs';

class Collection extends Map {
  push(key, value) {
    if (!this.has(key)) this.set(key, []);
    this.get(key).push(value);
  }
}

export const getRecipes = type =>
  fetch(`data/json/recipes/recipe_${type}.json`)
  .then(res => res.json())
  .then((list) => {
    const results = new Collection;
    const raws = new Collection;

    list.forEach((entry, i) => {
      const { result, components } = entry;

      results.push(result, i);
      
      (components || []).forEach((component) => {
        component.forEach((material) => {
          raws.push(material[0], i);
        });
      });
    });

    return { list, raws, results };
  });

export const getAllRecipes = () =>
  recipes.typelist.forEach((type) => {
    getRecipes(type).then((data) => {
      recipes.set(type, data);
    });
  });

export const getCoreBasic = (type) =>
  fetch(`data/core/basic.json`)
  .then(res => res.json());
export const getItems = (type) =>
  fetch(`data/json/items/${type}.json`)
  .then(res => res.json());

const getItemDir = (dir) =>
  fetch(`data/json/items/${dir}`)
  .then(res => res.json())

const flatten = arr =>
  arr.reduce((result, item) => result.concat(
    Array.isArray(item)
      ? flatten(item)
      : item
  ), []);

export const getAllItems = () =>
  getItemDir('')
  .then(list => Promise.all(list.map(({ name, type }) => {
    if (type === 'directory') {
      return getItemDir(name + '/')
      .then(list1 => list1.map((entry) => {
        if (entry.type === 'file') return name + '/' + entry.name;
        return '';
      }));
    } else if (type === 'file') {
      return name;
    }
    return '';
  }))).then(arr => Promise.all(
    flatten(arr)
    .map(name => name.endsWith('.json') ? name.slice(0, -5) : '')
    .filter(Boolean)
    .map(getItems)
    .concat(getCoreBasic())
  )).then((datalist) => {
    Array.prototype.concat.apply([], datalist).forEach((item) => {
      if (!item.id) return;
      if (items.has(item.id)) {
        if (!item.color) return;
      }
      items.set(item.id, item);
    });

    items.array = Array.from(items.values());

    return items;
  });

const getRequirementsDir = () =>
  fetch('data/json/requirements/')
  .then(res => res.json());
export const getRequirements = () =>
  getRequirementsDir()
  .then(list => Promise.all(list
    .filter(({ type }) => (type === 'file'))
    .map(({ name }) =>
      fetch(`data/json/requirements/${name}`)
      .then(res => res.json())
    )
  )).then((datalist) => {
    Array.prototype.concat.apply([], datalist).forEach((item) => {
      requirements.set(item.id, item);
    });
  });

const getPoString = str => str.slice(1, -1);

export const getLanguage = (locale) =>
  fetch(`data/lang/po/${locale}.po`)
  .then(res => res.text())
  .then((text) => {
    const blocks = text.split('\n\n');
    blocks.map((block) => {
      const lines = block.split('\n');
      let file;
      let msgid;
      let msgstr;
      let flag;
      lines.forEach((line) => {
        if (line.startsWith('#. ~')) { // description
          flag = '';
        } else if (line.startsWith('#, ')) { // format
          flag = '';
        } else if (line.startsWith('#: ')) { // file
          flag = '';
          file = line.slice(3);
        } else if (line.startsWith('# ')) { // comment
          flag = '';
        } else if (line.startsWith('msgid ')) {
          flag = '';
          msgid = getPoString(line.slice(6));
        } else if (line.startsWith('msgstr ')) {
          flag = '';
          msgstr = getPoString(line.slice(7));
          if (!msgstr) flag = 'msgstr';
        } else if (line.startsWith('msgstr[0] ')) {
          flag = '';
          msgstr = getPoString(line.slice(10));
          if (!msgid) flag = 'msgid';
        } else if (line.startsWith('"')) {
          const str = getPoString(line);
          if (flag === 'msgid') {
            msgid += str;
          } else if (flag === 'msgstr') {
            msgstr += str;
          }
        } else {
          flag = '';
        }
      });
      return { file, msgid, msgstr };
    })
    .filter(({ file }) => (file && file.startsWith('lang/')))
    .forEach(({ msgid, msgstr }) => {
      lang.set(msgid, msgstr);      
    });

    return lang;
  });
