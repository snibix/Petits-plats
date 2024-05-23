import { transformNormalize } from "../utils/tools.js";

function dropdownSearchUpdate(search, items) {
  search = transformNormalize(search.trim().toLowerCase());
  const links = items.querySelectorAll("a");

  if (search === "") {
    links.forEach((link) => {
      link.classList.remove("hidden");
    });
  } else {
    links.forEach((link) => {
      const textContent = transformNormalize(link.textContent.toLowerCase());
      if (textContent.includes(search)) {
        link.classList.remove("hidden");
      } else {
        link.classList.add("hidden");
      }
    });
  }
}

function createFilterDom(name, tab) {
  const dropdown = document.createElement("div");
  dropdown.className = "dropdown";

  const dropdownButton = document.createElement("button");
  dropdownButton.className = "dropdown-button";
  dropdownButton.textContent = name;

  // Ajoutez un gestionnaire d'événements au clic sur le bouton
  dropdownButton.addEventListener("click", (e) => {
    dropdown.classList.toggle("active");
  });

  const dropDownContent = document.createElement("div");
  dropDownContent.className = "dropdown-content";

  const dropdownSearch = document.createElement("input");
  dropdownSearch.type = "text";
  dropdownSearch.className = "dropdown-search";
  dropdownSearch.placeholder = "Rechercher";
  dropdownSearch.addEventListener("input", (e) => {
    e.preventDefault();
    dropdownSearchUpdate(dropdownSearch.value, dropdownList);
  });

  const dropdownList = document.createElement("div");
  dropdownList.id = name;

  Array.from(tab).forEach((element) => {
    const link = document.createElement("a");
    link.href = "#";
    link.className = "dropdown-item";
    link.textContent = element;
    dropdownList.appendChild(link);
  });

  dropDownContent.appendChild(dropdownSearch);
  dropDownContent.appendChild(dropdownList);

  dropdown.appendChild(dropdownButton);
  dropdown.appendChild(dropDownContent);

  return dropdown;
}

export function filterTemplate(recipes) {
  const container = document.createElement("div");
  container.className = "container";

  const filters = document.createElement("div");
  filters.className = "filters";

  const dropdowns = document.createElement("div");
  dropdowns.className = "dropdowns";

  // Pour éviter les répitions supprime les doublons
  const allIngredientSet = new Set();
  const allAppareilSet = new Set();
  const allUstensileSet = new Set();

  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      allIngredientSet.add(ingredient.ingredient);
    });
    allAppareilSet.add(recipe.appliance);
    allUstensileSet.add(recipe.ustensils);
  });

  const result = document.createElement("div");
  result.className = "results";
  result.textContent = `${recipes.length} recette(s)`;

  dropdowns.appendChild(createFilterDom("ingredients", allIngredientSet));
  dropdowns.appendChild(createFilterDom("appareils", allAppareilSet));
  dropdowns.appendChild(createFilterDom("ustensiles", allUstensileSet));

  filters.appendChild(dropdowns);
  filters.appendChild(result);

  container.appendChild(filters);

  return container;
}
// ajouter la croix a coter de l'input recherche , loupe cliclabe
// verifier la conformite avec la maquette
// terminer les fonctionnalités ajout retrait tag , dropdown logo
