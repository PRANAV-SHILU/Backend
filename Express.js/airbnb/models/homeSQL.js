import db from "../utils/databaseUtil.js";

export class Home {
  constructor(name, location, price) {
    this.name = name;
    this.location = location;
    this.price = price;
  }

  save() {
    return db.execute(`INSERT INTO homes (name, location, price) VALUES (?,?,?)`, [this.name, this.location, this.price]);
  }

  static fetchAll() {
    return db.execute("SELECT * FROM homes")
  }

  static findByID(homeID) {
    return db.execute(`SELECT * FROM homes WHERE id = ?`, [homeID]);
  }

  static editByID(homeID, updatedHome) {
    return db.execute(`UPDATE homes SET name = ?, location = ?, price = ? WHERE id = ?`, [updatedHome.name, updatedHome.location, updatedHome.price, homeID]);
  }

  static deleteByID(homeID) {
    return db.execute(`DELETE FROM homes WHERE id = ?`, [homeID]);
  }

}
