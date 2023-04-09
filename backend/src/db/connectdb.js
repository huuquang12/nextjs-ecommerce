const { default: mongoose } = require("mongoose");
const {
  db: { host, port, name },
} = require("../configs/db.config");

const connectString = `mongodb://${host}:${port}/${name}`;

class Database {
  constructor() {
    this.connect();
  }

  // connect
  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
  }

  connect() {
    mongoose
      .connect(connectString, {
        maxPoolSize: 50,
      })
      .then((_) => console.log(`Connected Mongodb Success ${name}`))
      .catch((err) => console.log(`Error Connect:: ${err}`));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
