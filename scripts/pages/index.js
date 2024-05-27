import { recipeCardTemplate } from "../templates/recipeCardTemplate.js";
import { filterTemplate } from "../templates/filtersTemplate.js"; // Assurez-vous d'importer le filterTemplate

class App {
  constructor() {
    this.recipes = []; // Initialiser la propriété recipes
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
      recipe.card = card;
      cardSection.appendChild(card);
    }
    // Afficher les filtres
    this.renderFilters();
  }
}

const app = new App();
app.run();
