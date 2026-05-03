import fs from "fs";
import path from "path";
import rootDir from "../utils/pathUtil.js";

export class Home {
  constructor(name, location, price) {
    this.name = name;
    this.location = location;
    this.price = price;
  }
  save() {
    // first fetch existant then push and write again
    Home.fetchAll((homes) => {
      homes.push(this);
      const filePath = path.join(rootDir, "data", "homes.json");
      fs.writeFile(filePath, JSON.stringify(homes), (err) =>
        console.log("err in writing file", err),
      );
    });
  }
  static fetchAll(callback) {
    const filePath = path.join(rootDir, "data", "homes.json");
    fs.readFile(filePath, (err, data) => {
      callback(err ? [] : data.length > 0 ? JSON.parse(data) : []);
    });
  }
}
