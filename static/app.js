import { getLanguage, getAllRecipes, getRequirements, getAllItems } from './data.mjs';
import { lang, items, recipes } from './store.mjs';

import rRecipe from './Components/Recipe.mjs';
import rItemDetails from './Components/ItemDetails.mjs';

const cleanNode = (node) => {
  while (node.firstChild) {
    cleanNode(node.firstChild);
    node.removeChild(node.firstChild);
  }
};

const recipeContainer = document.getElementById('recipe');
const recipeContent = recipeContainer.querySelector('main');
const recipeForm = recipeContainer.querySelector('form[name="filter"]');

const rNoResult = () => {
  const text = document.createElement('center');
  text.classList.add('no-result');
  text.appendChild(document.createTextNode('No Result'));
  return text;
};

const rRecipeList = (title, recipeList) => {
  const list = document.createElement('ul');
  list.classList.add('recipe-list');

  const h3 = document.createElement('h3');
  h3.appendChild(document.createTextNode(title));
  list.appendChild(h3);

  if (recipeList.length) {
    recipeList.forEach((recipe) => {
      const li = document.createElement('li');
      li.appendChild(rRecipe(recipe));
      list.appendChild(li);
    });
  } else {
    list.appendChild(rNoResult());
  }

  return list;
};

const recipeSearch = () => {
  const name = recipeForm.elements.namedItem('item-id').value.trim();

  cleanNode(recipeContent);

  recipes.typelist
  .map((type) => {
    if (!recipes.has(type)) return null;
    const { raws, results, list } = recipes.get(type);

    return {
      type,
      list,
      fromIds: results.has(name) ? results.get(name) : [],
      toIds: raws.has(name) ? raws.get(name) : [],
    };
  })
  .filter(Boolean)
  .forEach(({ type, list, fromIds, toIds }) => {
    const h2 = document.createElement('h2');
    h2.appendChild(document.createTextNode(type));

    const listFrom = rRecipeList('From:', fromIds.map(id => list[id]));
    const listTo = rRecipeList('To:', toIds.map(id => list[id]));

    const section = document.createElement('section');
    section.appendChild(h2);
    section.appendChild(listFrom);
    section.appendChild(listTo);

    recipeContent.appendChild(section);
  });
};

recipeForm.addEventListener('submit', (ev) => {
  if (ev) ev.preventDefault();
  recipeSearch();
});

recipeContent.addEventListener('click', (ev) => {
  if (ev.target.classList.contains('search-link')) {
    const dataset = ev.target.dataset;
    const id = dataset.id;
    recipeForm.elements.namedItem('item-id').value = id;
    recipeSearch();
  }
});

const searchContainer = document.getElementById('search');
const searchContent = searchContainer.querySelector('main');
const searchForm = searchContainer.querySelector('form[name="filter"]');

searchForm.addEventListener('submit', (ev) => {
  ev.preventDefault();

  const search = searchForm.elements.namedItem('item-name').value.trim();
  if (!search) return;

  cleanNode(searchContent);

  const list = document.createElement('ul');
  list.classList.add('item-list');

  items.array.filter((item) => {
    const id = item.id;
    const name = item.name;
    const tname = lang.has(name) ? lang.get(name) : '';

    return (id.indexOf(search) !== -1
      || (name && name.indexOf(search) !== -1)
      || (tname && tname.indexOf(search) !== -1)
    );
  }).forEach((item) => {

    const li = document.createElement('li');
    li.appendChild(rItemDetails(item));
    list.appendChild(li);
  });

  searchContent.appendChild(list);
});

(() => {
  getAllItems();
  getAllRecipes();
  getRequirements();
  getLanguage('zh_CN');
})();
