import { recipeCardTemplate } from "../templates/recipeCardTemplate.js";
import { filterTemplate } from "../templates/filtersTemplate.js";
import { viewClose } from "../utils/viewClose.js";
import { transformNormalize } from "../utils/tools.js";

class App {
  constructor() {
    this.recipes = []; // Initialiser la propriété recipes
    this.searchInput = document.getElementById("searchInput");
    this.closeSearch = document.getElementById("closeSearch");
    this.filteredRecipes = []; // Propriété pour les recettes filtrées

    this.searchInput.addEventListener("input", () => this.handleSearch()); // Écouteur d'événements pour la recherche
    this.closeSearch.addEventListener("click", () => this.clearSearch()); // Écouteur d'événements pour la croix de fermeture
  }

  // Chargement des données
  async load(url) {
    this.recipes = await fetch(url).then((res) => res.json());
  }

  async run() {
    await this.load("./data/recipes.json");
    this.render();
  }

  // Méthode pour créer et afficher les filtres
  renderFilters() {
    const filterSection = document.querySelector("#filters");
    const filters = filterTemplate(this.recipes);

    filterSection.innerHTML = ""; // Vider la section des filtres avant de la remplir
    filterSection.appendChild(filters);
  }

  render() {
    const cardSection = document.querySelector(".container .cards");
    cardSection.innerHTML = ""; // Vider la section des cartes avant de la remplir

    for (const recipe of this.recipes) {
      const card = recipeCardTemplate(recipe);
      card.dataset.name = transformNormalize(recipe.name.toLowerCase());
      card.dataset.ingredients = recipe.ingredients
        .map((ingredient) => {
          if (typeof ingredient === "string") {
            return ingredient.toLowerCase();
          }
        })
        .join(" ");
      card.dataset.description = transformNormalize(
        recipe.description.toLowerCase()
      );
      cardSection.appendChild(card);
    }

    this.renderFilters();
  }

  handleSearch() {
    const query = transformNormalize(this.searchInput.value.toLowerCase());

    const cardSection = document.querySelector(".container .cards");
    const cards = cardSection.querySelectorAll(".card");

    cards.forEach((card) => {
      const matches =
        card.dataset.name.includes(query) ||
        card.dataset.ingredients.includes(query) ||
        card.dataset.description.includes(query);

      if (matches) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });

    viewClose(query, this.closeSearch);
  }

  clearSearch() {
    this.searchInput.value = "";
    this.handleSearch();
    this.render(); // Re-rendre toutes les recettes
  }
}

const app = new App();
app.run();
