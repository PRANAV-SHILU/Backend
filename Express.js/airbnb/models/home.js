import fs from "fs";
import path from "path";
import rootDir from "../utils/pathUtil.js";

const filePath = path.join(rootDir, "data", "homes.json");

export class Home {
  constructor(name, location, price) {
    this.name = name;
    this.location = location;
    this.price = price;
  }
  save() {
    // first fetch existant then push and write again
    this.id = Math.random();
    Home.fetchAll((homes) => {
      homes.push(this);
      fs.writeFile(filePath, JSON.stringify(homes), (err) =>
        console.log("err in writing file", err),
      );
    });
  }
  static fetchAll(callback) {
    fs.readFile(filePath, (err, data) => {
      callback(err ? [] : data.length > 0 ? JSON.parse(data) : []);
    });
  }

  static findByID(homeID, callback) {
    Home.fetchAll((homes) => {
      const home = homes.find((h) => (h.id == homeID));
      callback(home);
    });
  }
}
