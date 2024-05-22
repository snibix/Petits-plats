export function filterTemplate(recipes) {
  const filterContainer = document.createElement("div");
  filterContainer.className = "container";

  const filter = document.createElement("div");
  filter.className = "filters";

  const dropDowns = document.createElement("div");
  dropDowns.className = "dropdowns";

  const dropDownIng = document.createElement("div");
  dropDownIng.className = "dropdown";

  const dropDownAp = document.createElement("div");
  dropDownAp.className = "dropdown";

  const dropDownUs = document.createElement("div");
  dropDownUs.className = "dropdown";

  const ingredientBtn = createButton("Ingredients");

  const dropBtn2 = createButton("Appareils");

  const dropBtn3 = createButton("Ustensiles");

  const dropDownContent1 = document.createElement("div");
  dropDownContent1.className = "dropdown-content";

  const dropDownContent2 = document.createElement("div");
  dropDownContent2.className = "dropdown-content";

  const dropDownContent3 = document.createElement("div");
  dropDownContent3.className = "dropdown-content";

  const searchIngredient = document.createElement("input");
  searchIngredient.type = "text";
  searchIngredient.className = "drop-input";
  searchIngredient.placeholder = "Rechercher";

  const searchAppareil = document.createElement("input");
  searchAppareil.type = "text";
  searchAppareil.className = "drop-input";
  searchAppareil.placeholder = "Rechercher";

  const searchUsentiles = document.createElement("input");
  searchUsentiles.type = "text";
  searchUsentiles.className = "drop-input";
  searchUsentiles.placeholder = "Rechercher";

  const ingredientContent = document.createElement("div");
  ingredientContent.id = "ingrédients";

  const aplianceContent = document.createElement("div");
  aplianceContent.id = "appareils";

  const UsentilesContent = document.createElement("div");
  UsentilesContent.id = "ustensiles";

  // Pour éviter supprimer les répitions
  const allIngredientsSet = new Set();
  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      allIngredientsSet.add(ingredient.ingredient);
    });
  });

  // Convertir l'ensemble en tableau
  const allIngredients = Array.from(allIngredientsSet);

  allIngredients.forEach((ingredient) => {
    const ingredientElement = document.createElement("a");
    ingredientElement.href = "#"; // Lien fictif pour un fonctionnement correct du clic
    ingredientElement.textContent = ingredient;
    ingredientContent.appendChild(ingredientElement);
  });

  const allAppareilSet = new Set();
  recipes.forEach((recipe) => {
    allAppareilSet.add(recipe.appliance);
  });

  const allAppareil = Array.from(allAppareilSet);

  allAppareil.forEach((appliance) => {
    const applianceElement = document.createElement("a");
    applianceElement.href = "#";
    applianceElement.textContent = appliance;
    aplianceContent.appendChild(applianceElement);
  });

  const allUstebsileSet = new Set();
  recipes.forEach((recipe) => {
    allUstebsileSet.add(recipe.ustensils);
  });

  const allUstebsile = Array.from(allUstebsileSet);

  allUstebsile.forEach((ustensils) => {
    const ustensilesElement = document.createElement("a");
    ustensilesElement.href = "#";
    ustensilesElement.textContent = ustensils;
    UsentilesContent.appendChild(ustensilesElement);
  });

  const result = document.createElement("div");
  result.className = "results";
  result.textContent = "1500 recettes";

  dropDownContent1.appendChild(searchIngredient);
  dropDownContent1.appendChild(ingredientContent);

  dropDownContent2.appendChild(searchAppareil);
  dropDownContent2.appendChild(aplianceContent);

  dropDownContent3.appendChild(searchUsentiles);
  dropDownContent3.appendChild(UsentilesContent);

  dropDownIng.appendChild(ingredientBtn);
  dropDownIng.appendChild(dropDownContent1);

  dropDownAp.appendChild(dropBtn2);
  dropDownAp.appendChild(dropDownContent2);

  dropDownUs.appendChild(dropBtn3);
  dropDownUs.appendChild(dropDownContent3);

  dropDowns.appendChild(dropDownIng);
  dropDowns.appendChild(dropDownAp);
  dropDowns.appendChild(dropDownUs);

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
