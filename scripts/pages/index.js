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
  }

  // Chargement des données
  async load(url) {
    this.recipes = await fetch(url).then((res) => res.json());
  }

  getAllCategories(recipes) {
    const allIngredients = [];
    const allAppareils = [];
    const allUstensiles = [];

    recipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        allIngredients.push(ingredient.ingredient);
      });
      allAppareils.push(recipe.appliance);
      allUstensiles.push(...recipe.ustensils);
    });

    return [
      [...new Set(allIngredients)].sort(),
      [...new Set(allAppareils)].sort(),
      [...new Set(allUstensiles)].sort(),
    ];
  }

  prepare() {
    this.recipes.forEach((recipe) => {
      recipe.ingredients = recipe.ingredients.map((ingredient) => {
        ingredient.ingredient = ingredient.ingredient.toLowerCase();
        return ingredient;
      });
      recipe.appliance = recipe.appliance.toLowerCase();
      recipe.ustensils = recipe.ustensils.map((ustensil) =>
        ustensil.toLowerCase()
      );
    });
    [this.ingredients, this.appliances, this.ustensils] = this.getAllCategories(
      this.recipes
    );

    this.mainFilters = this.recipes;
    this.tagFilters = this.recipes;
  }

  renderHeader() {
    const mainSearch = document.getElementById("main-search");
    mainSearch.addEventListener("input", (e) => {
      this.updateMainSearch(e.target.value);
    });
    document
      .getElementById("close-main-search")
      .addEventListener("click", (e) => {
        e.preventDefault();
        mainSearch.value = "";
        this.updateMainSearch("");
      }); // boutton de reset;
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

  renderRecipes() {
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

  render() {
    this.renderHeader();
    this.renderFilters();
    this.renderRecipes();
  }

  updateMainSearch(search) {
    if (search.length >= 3) {
      search = transformNormalize(search.toLowerCase());
      // TODO: sépare le texte dans search en tableau de mots
      this.mainFilters = this.recipes.filter((recipe) => {
        // TODO: recherche par groupe de lettre
        const found = recipe.ingredients.some((ingredient) => {
          return transformNormalize(ingredient.ingredient).includes(search);
        });

        if (
          transformNormalize(recipe.name.toLowerCase()).includes(search) ||
          found ||
          transformNormalize(recipe.description.toLowerCase()).includes(search)
        ) {
          return true;
        }
        return false;
      });
    } else {
      this.mainFilters = this.recipes;
    }
    this.renderRecipes();
  }

  updateTagSearch() {
    const tags = document.querySelector(".content-tags-search");

    const ingredients = Array.from(
      tags.querySelectorAll('[data-category="ingredients"]')
    ).map((item) => item.textContent);

    const appliances = Array.from(
      tags.querySelectorAll('[data-category="appareils"]')
    ).map((item) => item.textContent);

    const ustensils = Array.from(
      tags.querySelectorAll('[data-category="ustensiles"]')
    ).map((item) => item.textContent);

    this.tagFilters = this.recipes.filter((recipe) => {
      if (appliances.length > 0 && !appliances.includes(recipe.appliance)) {
        return false;
      }
      return (
        ustensils.every((item) => recipe.ustensils.includes(item)) &&
        ingredients.every((item) =>
          recipe.ingredients.find((img) => img.ingredient === item)
        )
      );
    });
    this.renderRecipes();
  }

  async run() {
    await this.load("./data/recipes.json");
    this.prepare();
    this.render();
  }
}

const app = new App();
await app.run();

// TODO:  loupe  de recherhe au click lance la recherche

// TODO : dropdown au click exterieur doit se ferme
