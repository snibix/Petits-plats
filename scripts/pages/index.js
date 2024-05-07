class App {
  constructor() {}

  // Chargement des données
  async load(url) {
    this.recipes = await fetch(url).then((res) => res.json());
  }
  async run() {
    await this.load("./data/recipes.json");
    console.log(this.load());
  }
}

const app = new App();
app.run();
