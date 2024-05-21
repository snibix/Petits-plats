export function filterTemplate(recipe) {
  const filterContainer = document.createElement("div");
  filterContainer.className = "container";

  const filter = document.createElement("div");
  filter.className = "filters";

  const dropDowns = document.createElement("div");
  dropDowns.className = "dropdowns";

  const dropDown = document.createElement("div");
  dropDown.className = "dropdown";

  const result = document.createElement("div");
  result.className = "results";
  result.textContent = "1500 recettes";

  const dropBtn1 = createButton("Ingredients");
  const dropBtn2 = createButton("Appareils");
  const dropBtn3 = createButton("Ustensiles");

  // Ajoutez le bouton dropBtn au dropdown dropDown
  dropDown.appendChild(dropBtn1);
  dropDown.appendChild(dropBtn2);
  dropDown.appendChild(dropBtn3);
  // Ajoutez le dropdown dropDown à la section dropdowns
  dropDowns.appendChild(dropDown);

  // Ajoutez la section dropdowns à la div filter
  filter.appendChild(dropDowns);
  filter.appendChild(result);
  // Ajoutez la div filter à la div container
  filterContainer.appendChild(filter);
  // Retournez l'élément racine filterSection
  return filterContainer;
}
function createButton(text) {
  const dropBtn = document.createElement("button");
  dropBtn.className = "dropbtn";
  dropBtn.textContent = text;

  // Ajoutez un gestionnaire d'événements au clic sur le bouton
  dropBtn.addEventListener("click", () => {
    const dropdownContent = document.querySelector(".dropdown-content");
    if (dropdownContent) {
      dropdownContent.classList.toggle("active");
      dropBtn.classList.toggle("active");
    } else {
      dropdownContent.classList.remove("active");
      dropBtn.classList.remove("active");
    }
  });

  return dropBtn;
}
