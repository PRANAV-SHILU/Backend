// fake database
const homes = [];

export class Home {
  constructor(name, location, price) {
    this.name = name;
    this.location = location;
    this.price = price;
  }
  save() {
    homes.push(this);
  }
  // call: const details = Home.fetchAll()
  static fetchAll() {
    return homes;
  }
}
