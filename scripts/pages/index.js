import { recipeCardTemplate } from "../templates/recipeCardTemplate.js";
import { filterTemplate } from "../templates/filtersTemplate.js";
import { transformNormalize } from "../utils/tools.js";
import { updateDropdown } from "../components/dropdown.js";

class App {
  constructor() {
    this.recipes = []; // Liste des recettes
    this.mainFilters = [];
    this.tagFilters = [];

    this.appliances = []; // Liste des appareils
    this.ingredients = []; // Liste des ingredients
    this.ustensils = []; // Liste des ustensiles

    this.searchInput = document.getElementById("searchInput");
    this.closeSearch = document.getElementById("closeSearch");

    this.searchInput.addEventListener("input", this.handleSearch.bind(this)); // Écouteur d'événements pour la recherche
    this.closeSearch.addEventListener("click", () => this.clearSearch()); // Écouteur d'événements pour la croix de fermeture
  }

  // Chargement des données
  async load(url) {
    this.recipes = await fetch(url).then((res) => res.json());
  }

  //
  getAllCategories(recipes) {
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

    return [
      [...new Set(allIngredients)].sort(),
      [...new Set(allAppareils)].sort(),
      [...new Set(allUstensiles)].sort(),
    ];
  }

  prepare() {
    [this.ingredients, this.appliances, this.ustensils] = this.getAllCategories(
      this.recipes
    );

    this.mainFilters = this.recipes;
    this.tagFilters = this.recipes;
  }

  async run() {
    await this.load("./data/recipes.json");
    this.prepare();
    this.renderFilters();
    this.render();
  }

  // Méthode pour créer et afficher les filtres
  renderFilters() {
    const filterSection = document.querySelector("#filters");
    const filters = filterTemplate(
      this.ingredients,
      this.appliances,
      this.ustensils,
      () => {
        this.updateTagSearch();
      }
    );

    filterSection.innerHTML = ""; // Vider la section des filtres avant de la remplir
    filterSection.appendChild(filters);
  }

  render() {
    // intersection des 2 tableaux de recette filtré
    const recipes = this.mainFilters.filter((recipe) =>
      this.tagFilters.includes(recipe)
    );

    const [ingredients, appliances, ustensils] = this.getAllCategories(recipes);
    updateDropdown("ingredients", ingredients);
    updateDropdown("appareils", appliances);
    updateDropdown("ustensiles", ustensils);

    const cardSection = document.querySelector(".container .cards");
    cardSection.innerHTML = ""; // Vider la section des cartes avant de la remplir

    for (const recipe of recipes) {
      const card = recipeCardTemplate(recipe);
      cardSection.appendChild(card);
    }

    document.querySelector(
      "#recipe-counter"
    ).textContent = `${recipes.length} recette(s)`;
  }

  handleSearch() {
    const query = this.searchInput.value;
    this.closeSearch.classList.toggle("hidden", query === "");
    this.updateMainSearch(query);
  }

  updateTagSearch() {
    const tags = document.querySelector(".content-tags-search");

    const ingredients = Array.from(
      tags.querySelectorAll('[data-category="ingredients"]')
    ).map((item) => item.textContent);

    const appareils = Array.from(
      tags.querySelectorAll('[data-category="appareils"]')
    ).map((item) => item.textContent);

    const ustensiles = Array.from(
      tags.querySelectorAll('[data-category="ustensiles"]')
    ).map((item) => item.textContent);

    this.tagFilters = this.recipes.filter((recipe) => {
      let filtered = true;
      if (
        appareils.length > 0 &&
        !appareils.includes(recipe.appliance.toLowerCase())
      ) {
        filtered = false;
      }

      if (
        ustensiles.length > 0 &&
        !ustensiles.every((item) => {
          return recipe.ustensils.includes(item);
        })
      ) {
        filtered = false;
      }

      if (
        ingredients.length > 0 &&
        !ingredients.every((item) => {
          return (
            recipe.ingredients.find(
              (img) => img.ingredient.toLowerCase() === item
            ) !== undefined
          );
        })
      ) {
        filtered = false;
      }

      return filtered;
    });
    this.render();
  }

  updateMainSearch(search) {
    const results = [];
    search = transformNormalize(search.toLowerCase());
    this.recipes.forEach((recipe) => {
      const found = recipe.ingredients.some((ingredient) => {
        return transformNormalize(ingredient.ingredient)
          .toLowerCase()
          .includes(search);
      });

      if (
        transformNormalize(recipe.name.toLowerCase()).includes(search) ||
        found ||
        transformNormalize(recipe.description.toLowerCase()).includes(search)
      ) {
        results.push(recipe);
      }
    });
    this.mainFilters = results;
    this.render();
  }

  clearSearch() {
    this.searchInput.value = "";
    this.handleSearch();
  }
}

const app = new App();
await app.run();
