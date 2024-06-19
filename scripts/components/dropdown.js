import { transformNormalize } from "../utils/tools.js";

// Fonction pour mettre à jour la recherche dans le dropdown
function dropdownSearchUpdate(search, items) {
  search = transformNormalize(search.trim().toLowerCase());
  const links = items.querySelectorAll("a");
  if (search === "") {
    // Afficher tous les liens si la recherche est vide
    links.forEach((link) => {
      link.classList.remove("filtered");
    });
  } else {
    // Filtrer les liens en fonction de la recherche
    links.forEach((link) => {
      const textContent = transformNormalize(link.textContent);
      link.classList.toggle("filtered", !textContent.includes(search));
    });
  }
}

// Fonction pour ajouter un tag
function addTag(link, tags, tagEvent) {
  // Sélectionne le lien
  link.classList.add("dropdown-selected");

  // Crée et ajoute le nouveau badge
  const contentTag = document.createElement("div");
  contentTag.className = "tag-search";
  contentTag.dataset.category = link.closest(".dropdown").dataset.name;

  const contentText = document.createElement("p");
  contentText.textContent = link.textContent;

  const contentClose = document.createElement("img");
  contentClose.src = "./assets/img/close-black.svg";
  contentClose.className = "close-badge";
  contentClose.alt = "close";

  contentTag.appendChild(contentText);
  contentTag.appendChild(contentClose);

  tags.appendChild(contentTag);

  // Ajouter un événement pour supprimer le tag lorsqu'on clique sur la croix
  contentClose.addEventListener("click", (e) => {
    e.preventDefault();
    removeTag(link, contentTag, tags);
    tagEvent(); // Mettre à jour les résultats de la recherche
  });
}

// Fonction pour supprimer un tag
function removeTag(link, tag, tags) {
  link.classList.remove("dropdown-selected");

  if (tag === null) {
    const category = link.closest(".dropdown").dataset.name;

    const tagList = tags.querySelectorAll(".tag-search");

    // Rechercher et supprimer le tag correspondant
    for (let i = tagList.length - 1; i >= 0; i--) {
      const item = tagList[i];
      if (
        item.textContent.trim() === link.textContent.trim() &&
        item.dataset.category === category
      ) {
        tag = item;
        break;
      }
    }
  }
  tag?.remove(); // Supprimer le tag
}

export function createDropdownDOM(name, list, tagEvent) {
  const dropdown = document.createElement("div");
  dropdown.className = "dropdown";
  dropdown.dataset.name = name;

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
  closeSearch.src = "./assets/img/close-gray.svg";
  closeSearch.alt = "";
  closeSearch.className = "dropdown-search-close hidden";

  // Mettre à jour la liste des éléments en fonction de la recherche
  dropdownSearch.addEventListener("input", (e) => {
    e.preventDefault();
    dropdownSearchUpdate(dropdownSearch.value, dropdownList);
    closeSearch.classList.toggle("hidden", dropdownSearch.value === "");
  });

  // Réinitialiser la recherche lorsqu'on clique sur la croix
  closeSearch.addEventListener("click", (e) => {
    e.preventDefault();
    dropdownSearch.value = "";
    dropdownSearchUpdate(dropdownSearch.value, dropdownList);
    closeSearch.classList.toggle("hidden", dropdownSearch.value === "");
  });

  const dropdownList = document.createElement("div");
  dropdownList.id = name;
  dropdownList.className = "dropdown-list";

  const tags = document.querySelector(".content-tags-search"); // Sélectionnez le bon conteneur

  list.forEach((element) => {
    const link = document.createElement("a");
    link.href = "#";
    link.className = "dropdown-item";
    link.textContent = element;
    link.addEventListener("click", (e) => {
      e.preventDefault();
      // Ajouter ou supprimer un tag selon l'état actuel
      if (link.classList.contains("dropdown-selected")) {
        removeTag(link, null, tags);
      } else {
        addTag(link, tags, tagEvent);
      }
      tagEvent();
    });
    dropdownList.appendChild(link);
  });

  dropDownContent.appendChild(closeSearch);
  dropDownContent.appendChild(dropdownSearch);
  dropDownContent.appendChild(dropdownList);

  dropdown.appendChild(dropdownButton);
  dropdown.appendChild(dropDownContent);

  return dropdown;
}

// Fonction pour mettre à jour les éléments du dropdown
export function updateDropdown(name, list) {
  const dropdownIngredientItems = document.querySelectorAll(
    `#${name} .dropdown-item`
  );
  dropdownIngredientItems.forEach((item) => {
    item.classList.toggle("hidden", !list.includes(item.textContent));
  });
}
