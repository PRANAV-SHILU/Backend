import fs from "fs";
import path from "path";
import rootDir from "../utils/pathUtil.js";

const filePath = path.join(rootDir, "data", "homes.json");
const favouritesPath = path.join(rootDir, "data", "favourites.json");

export class Home {
  constructor(name, location, price) {
    this.name = name;
    this.location = location;
    this.price = price;
  }

  save(callback) {
    // first fetch existant then push and write again
    this.id = Math.random();
    Home.fetchAll((homes) => {
      homes.push(this);
      fs.writeFile(filePath, JSON.stringify(homes), (err) => {
        if (callback) {
          callback(err);
        } else {
          console.log("err in writing file", err);
        }
      });
    });
  }

  static fetchAll(callback) {
    fs.readFile(filePath, (err, data) => {
      callback(err ? [] : data.length > 0 ? JSON.parse(data) : []);
    });
  }

 

  static findByID(homeID, callback) {
    Home.fetchAll((homes) => {
      const home = homes.find((h) => h.id == homeID);
      callback(home);
    });
  }

  static editByID(homeID, updatedHome, callback) {
    Home.fetchAll((homes) => {
      const homeIndex = homes.findIndex((h) => h.id == homeID);
      if (homeIndex !== -1) {
        homes[homeIndex] = { ...homes[homeIndex], ...updatedHome };
        fs.writeFile(filePath, JSON.stringify(homes), (err) =>
          callback(err),
        );
      }
    });
  }

  static deleteByID(homeID, callback) {
    Home.fetchAll((homes) => {
      const remainigHomes = homes.filter((h) => h.id !== homeID);
      fs.writeFile(filePath, JSON.stringify(remainigHomes), (err) =>
        callback(err),
      );
    });
  }

}
