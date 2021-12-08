const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const express = require("express");
const app = express();
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:3000",
};
app.use(cors(corsOptions));

const { Pool } = require("pg");
const { json } = require("express");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "proximity_network",
  password: "fran1985",
  port: 5432,
});

//middlewares


const checkDuplicatedEmail = (req, res, next) => {
  const email = req.body.managerEmail;
  pool
    .query(
      "SELECT  manager_email FROM stores_authentications WHERE manager_email = $1",
      [email]
    )
    .then((result) => {
        console.log(result.rows)
      if (result.rows.length > 0) {
        return res.status(400).send({
          messege: "Error! ya existe una cuenta vinculada a este email!",
        });
      }
      next();
    })
    .catch((error)=> console.log(error));
};

//FUNCTION
const registerController = (req, res) => {
  const newUser = req.body;
  newUser.password = bcrypt.hashSync(newUser.password, 6);
  pool
    .query(
      "INSERT INTO stores_authentications ( store_manager, manager_email, password) VALUES ( $1, $2, $3)",
      [newUser.storeManager, newUser.managerEmail, newUser.password]
    )
    .then(() => {
      res.status(200).send({ message: "store user created!" });
    })
    .catch((error) => {
      console.log(error);
    });
};

//AUTH ENDPOINTS
app.post("/register", checkDuplicatedEmail, registerController);

//PUBLIC ENDPOINTS
app.get("/", (req, res) => {
  // display the home page
  const nameApp = { App: "Proximity network" };
  res.status(200).send(nameApp);
});
app.get("/stores", (req, res) => {
  // return list of all stores
  pool
    .query("SELECT * FROM stores")
    .then((result) => res.json(result.rows))
    .catch((e) => console.log(e));
});
app.get("/stores/:city", (req, res) => {
  //return list of stores filtered by city
  const city = req.params.city;
  pool
    .query(
      "SELECT name, store_description as Description, store_category as Category, web_page as Web, store_email as email, phone_number, image FROM stores as s join stores_locations as s_l on s_l.store_id = s.id WHERE upper(city) = upper($1)",
      [city]
    )

    .then((result) => res.json(result.rows))
    .catch((e) => console.log(e));
});
app.get("/stores/search/:storeName", (req, res) => {
  //return list of stores if the given  filtered by name
  const storeName = `%${req.params.storeName}%`;
  pool
    .query(
      "SELECT name, store_description as Description, store_category as Category, web_page as Web, store_email as email, phone_number, image FROM stores as s WHERE UPPER(name) LIKE UPPER($1) ORDER BY name",
      [storeName]
    )
    .then((result) => res.json(result.rows))
    .catch((e) => console.log(e));
});
app.get("/stores/profile/:storeId", (req, res) => {
  //return data of given store
  const storeId = req.params.storeId;
  pool
    .query("SELECT * FROM stores WHERE id = $1", [storeId])
    .then((result) => res.json(result.rows))
    .catch((e) => console.log(e));
});
app.get("/products/:productId", (req, res) => {
  //return data of the given product
  const productId = req.params.productId;

  pool
    .query("SELECT * FROM products WHERE id = $1", [productId])
    .then((result) => res.json(result.rows))
    .catch((e) => console.log(e));
});
app.get("/products/storeProducts/:storeId", (req, res) => {
  //return data of the given product
  const storeId = req.params.storeId;

  pool
    .query("SELECT * FROM products WHERE store_id = $1", [storeId])
    .then((result) => res.json(result.rows))
    .catch((e) => console.log(e));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`proximity network is running in port ${PORT}`)
);
