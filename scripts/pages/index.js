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

    // loupe au click lance la recherche
    document.querySelector(".form-search").addEventListener("submit", (e) => {
      e.preventDefault();
      const mainSearch = document.getElementById("main-search");
      this.updateMainSearch(mainSearch.value);
    });
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
    search = transformNormalize(search.trim()).toLowerCase();
    // sépare le texte dans search en tableau de mots
    const wordsArray = search.split(/\s+/);
    // .filter((word) => word.length >= 3)
    const words = [];
    for (let i = 0; i < wordsArray.length; i++) {
      const word = wordsArray[i];
      if (word.length >= 3) {
        words.push(word);
      }
    }
    if (words.length > 0) {
      let mainFilters = [];

      for (let i = 0; i < this.recipes.length; i++) {
        let recipe = this.recipes[i];
        let foundInRecipe = false;

        for (let j = 0; j < words.length; j++) {
          let word = words[j];
          let found = false;

          for (let k = 0; k < recipe.ingredients.length; k++) {
            let ingredient = recipe.ingredients[k];
            if (transformNormalize(ingredient.ingredient).includes(word)) {
              found = true;
              break;
            }
          }
          if (
            transformNormalize(recipe.name.toLowerCase()).includes(word) ||
            found ||
            transformNormalize(recipe.description.toLowerCase()).includes(word)
          ) {
            foundInRecipe = true;
            break;
          }
        }
        if (foundInRecipe) {
          mainFilters.push(recipe);
        }
      }
      this.mainFilters = mainFilters;
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
    // evenement qui ferme le dropdown au clique exterieur
    document.addEventListener("click", (e) => {
      const dropdowns = document.querySelectorAll(".dropdown.active");
      const target = e.target.closest(".dropdown");
      dropdowns.forEach((dropdown) => {
        if (dropdown !== target) {
          dropdown.classList.remove("active");
        }
      });
    });
  }
}

const app = new App();
await app.run();
