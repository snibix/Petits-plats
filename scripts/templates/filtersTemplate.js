export function filterTemplate(recipes) {
  const filterContainer = document.createElement("div");
  filterContainer.className = "container";

  const filter = document.createElement("div");
  filter.className = "filters";

  const dropDowns = document.createElement("div");
  dropDowns.className = "dropdowns";

  // Pour éviter les répitions supprime les doublons
  const allIngredientsSet = new Set();
  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      allIngredientsSet.add(ingredient.ingredient);
    });
  });

  const allAppareilSet = new Set();
  recipes.forEach((recipe) => {
    allAppareilSet.add(recipe.appliance);
  });

  const allUstensibleSet = new Set();
  recipes.forEach((recipe) => {
    allUstensibleSet.add(recipe.ustensils);
  });

  function createFilterDom(tab, name) {
    const filterContainer = document.createElement("div");
    filterContainer.className = "container";

    const filter = document.createElement("div");
    filter.className = "filters";

    const dropDowns = document.createElement("div");
    dropDowns.className = "dropdowns";

    const content = document.createElement("div");
    content.id = name;

    const dropDownContent = document.createElement("div");
    dropDownContent.className = "dropdown-content";

    const dropDown = document.createElement("div");
    dropDown.className = "dropdown";

    const btn = createButton(name);

    const search = document.createElement("input");
    search.type = "text";
    search.className = "drop-input";
    search.placeholder = "Rechercher";

    const result = document.createElement("div");
    result.className = "results";
    result.textContent = "1500 recettes";

    Array.from(tab).forEach((element) => {
      const link = document.createElement("a");
      link.href = "#";
      link.textContent = element;
      content.appendChild(link);
    });
    dropDownContent.appendChild(search);
    dropDownContent.appendChild(content);

    dropDown.appendChild(btn);
    dropDown.appendChild(dropDownContent);

    return dropDown;
  }

  const result = document.createElement("div");
  result.className = "results";
  result.textContent = "1500 recettes";

  dropDowns.appendChild(createFilterDom(allIngredientsSet, "ingredient"));
  dropDowns.appendChild(createFilterDom(allAppareilSet, "appareils"));
  dropDowns.appendChild(createFilterDom(allUstensibleSet, "ustensible"));

  filter.appendChild(dropDowns);
  filter.appendChild(result);

  filterContainer.appendChild(filter);

  return filterContainer;
}
function createButton(text) {
  const dropBtn = document.createElement("button");
  dropBtn.className = "dropbtn";
  dropBtn.textContent = text;

  // Ajoutez un gestionnaire d'événements au clic sur le bouton
  dropBtn.addEventListener("click", (e) => {
    const dropdownContent = e.target.nextElementSibling;
    if (dropdownContent) {
      dropdownContent.classList.toggle("active");
      e.target.classList.toggle("active");
    } else {
      dropdownContent.classList.remove("active");
      e.target.classList.remove("active");
    }
  });

  return dropBtn;
}
