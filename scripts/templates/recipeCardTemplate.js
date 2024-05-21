export function recipeCardTemplate(recipe) {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.id = recipe.id;

  const img = document.createElement("img");
  img.className = "card-img";
  img.src = `assets/photos/${recipe.image}`;
  img.alt = "Photo de la recette";

  const badge = document.createElement("span");
  badge.className = "badge";
  badge.textContent = `${recipe.time} mn`;

  const body = document.createElement("section");
  body.className = "card-body";

  const recetteTitle = document.createElement("h2");
  recetteTitle.className = "title";
  recetteTitle.textContent = recipe.name;

  const recettes = document.createElement("h3");
  recettes.textContent = "Recettes";

  const desc = document.createElement("p");
  desc.className = "desc";
  desc.textContent = recipe.description;

  const ingredients = document.createElement("h3");
  ingredients.className = "ingredients";
  ingredients.textContent = "Ingredients";

  const recetteIngredient = document.createElement("div");
  recetteIngredient.className = "ingredients";

  for (const ingredient of recipe.ingredients) {
    const div = document.createElement("div");
    div.className = "ingredient";
    const h4 = document.createElement("h4");
    h4.className = "name";
    h4.textContent = ingredient.ingredient;
    const quantity = document.createElement("p");
    quantity.className = "quantity";
    if (ingredient.unit) {
      quantity.textContent = `${ingredient.quantity} ${ingredient.unit}`;
    } else {
      quantity.textContent = `${ingredient.quantity}`;
    }
    div.appendChild(h4);
    div.appendChild(quantity);
    recetteIngredient.appendChild(div);
  }

  body.appendChild(recetteTitle);
  body.appendChild(recettes);
  body.appendChild(desc);
  body.appendChild(ingredients);
  body.appendChild(recetteIngredient);

  card.appendChild(img);
  card.appendChild(badge);
  card.appendChild(body);
  return card;
}
