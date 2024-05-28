import { recipeCardTemplate } from "../templates/recipeCardTemplate.js";
import { filterTemplate } from "../templates/filtersTemplate.js"; // Assurez-vous d'importer le filterTemplate

class App {
  constructor() {
    this.recipes = []; // Initialiser la propriété recipes
    this.searchInput = document.getElementById("searchInput"); // Champ de recherche
    this.filteredRecipes = []; // Propriété pour les recettes filtrées

    this.searchInput.addEventListener("input", () => this.handleSearch()); // Écouteur d'événements pour la recherche
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
    const filters = filterTemplate(this.recipes); // Assurez-vous que filterTemplate renvoie les filtres nécessaires

    filterSection.innerHTML = ""; // Vider la section des filtres avant de la remplir
    filterSection.appendChild(filters);
  }

  render() {
    const cardSection = document.querySelector(".container .cards");
    cardSection.innerHTML = ""; // Vider la section des cartes avant de la remplir

    for (const recipe of this.recipes) {
      const card = recipeCardTemplate(recipe);
      card.dataset.name = recipe.name.toLowerCase();
      card.dataset.ingredients = recipe.ingredients
        .map((ingredient) => {
          if (typeof ingredient === "string") {
            return ingredient.toLowerCase();
          }
        })
        .join(" ");
      card.dataset.description = recipe.description.toLowerCase();
      cardSection.appendChild(card);
    }

    this.renderFilters();
  }

  handleSearch() {
    const query = this.searchInput.value.toLowerCase();

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
  }
}

const app = new App();
app.run();
