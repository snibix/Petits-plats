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
  console.log(search);
}

function viewClose(search, close) {
  if (search === "") {
    close.classList.add("hidden");
  } else {
    close.classList.remove("hidden");
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

  const closeSearch = document.createElement("img");
  closeSearch.src = "assets/img/close-gray.svg";
  closeSearch.alt = "";
  closeSearch.className = "dropdown-search-close hidden";

  //Evenement qui recherche dans la liste en fonction de la recherche dans l'input
  dropdownSearch.addEventListener("input", (e) => {
    e.preventDefault();
    dropdownSearchUpdate(dropdownSearch.value, dropdownList);
    viewClose(dropdownSearch.value, closeSearch);
  });

  //Evenement qui reset la recherche au click de la croix
  closeSearch.addEventListener("click", (e) => {
    e.preventDefault();
    dropdownSearch.value = "";
    dropdownSearchUpdate(dropdownSearch.value, dropdownList);
    viewClose(dropdownSearch.value, closeSearch);
  });

  const dropdownList = document.createElement("div");
  dropdownList.id = name;

  Array.from(tab).forEach((element) => {
    const link = document.createElement("a");
    link.href = "#";
    link.className = "dropdown-item";
    link.textContent = element;
    dropdownList.appendChild(link);
    addBadge(link);
  });
  dropDownContent.appendChild(closeSearch);
  dropDownContent.appendChild(dropdownSearch);
  dropDownContent.appendChild(dropdownList);

  dropdown.appendChild(dropdownButton);
  dropdown.appendChild(dropDownContent);

  return dropdown;
}

function addBadge(link) {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    link.className = "dropdown-link";
    const containerBadge = document.querySelector(".content-label-search"); // Sélectionnez le bon conteneur
    const contentBadge = document.createElement("div");
    contentBadge.setAttribute("class", "label-search");
    contentBadge.innerHTML = ` 
      <p>${link.textContent}</p>
      <img src="./assets/img/close-black.svg" alt="close" class="close-badge">
    `;
    containerBadge.appendChild(contentBadge);
    console.log(containerBadge);
    const closeButton = contentBadge.querySelector("img");
    closeButton.addEventListener("click", () => {
      link.className = "dropdown-item";
      containerBadge.removeChild(contentBadge);
    });
  });
}

export function filterTemplate(recipes) {
  const container = document.createElement("div");
  container.className = "container";

  const filters = document.createElement("div");
  filters.className = "filters";

  const dropdowns = document.createElement("div");
  dropdowns.className = "dropdowns";

  // Extraction de toutes les valeurs uniques
  const allIngredients = [];
  const allAppareils = [];
  const allUstensiles = [];

  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      allIngredients.push(ingredient.ingredient.toLowerCase()); // Convertir en minuscules
    });
    allAppareils.push(recipe.appliance.toLowerCase());
    allUstensiles.push(...recipe.ustensils.map((u) => u.toLowerCase()));
  });

  // Suppression des doublons et tri par ordre alphabétique
  const uniqueIngredients = [...new Set(allIngredients)].sort((a, b) =>
    a.localeCompare(b)
  ); // Utilisation de localeCompare pour le tri insensible à la casse
  const uniqueAppareils = [...new Set(allAppareils)].sort((a, b) =>
    a.localeCompare(b)
  ); // Utilisation de localeCompare pour le tri insensible à la casse
  const uniqueUstensiles = [...new Set(allUstensiles)].sort((a, b) =>
    a.localeCompare(b)
  );

  const result = document.createElement("div");
  result.className = "results";
  result.textContent = `${recipes.length} recette(s)`;

  dropdowns.appendChild(createFilterDom("ingredients", uniqueIngredients));
  dropdowns.appendChild(createFilterDom("appareils", uniqueAppareils));
  dropdowns.appendChild(createFilterDom("ustensiles", uniqueUstensiles));

  filters.appendChild(dropdowns);
  filters.appendChild(result);

  container.appendChild(filters);

  return container;
}
// voir pour terminer la fonctionnalité au click de reset input value la remettre a 0 , loupe cliclable
// terminer les fonctionnalités ajout retrait tag , dropdown logo
