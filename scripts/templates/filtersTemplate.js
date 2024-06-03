import { createDropdownDOM } from "../components/dropdown.js";

export function filterTemplate(ingredients, appliances, ustensils, tagEvent) {
  const container = document.createElement("div");
  container.className = "container";

  const filters = document.createElement("div");
  filters.className = "filters";

  const dropdowns = document.createElement("div");
  dropdowns.className = "dropdowns";

  const results = document.createElement("div");
  results.id = "recipe-counter";
  results.className = "results";
  results.textContent = `Aucune recette`;

  dropdowns.appendChild(
    createDropdownDOM("ingredients", ingredients, tagEvent)
  );
  dropdowns.appendChild(createDropdownDOM("appareils", appliances, tagEvent));
  dropdowns.appendChild(createDropdownDOM("ustensiles", ustensils, tagEvent));

  filters.appendChild(dropdowns);
  filters.appendChild(results);

  container.appendChild(filters);

  return container;
}
