const express = require("express");
const users = require("./data/agentes");
const app = express();
const jwt = require("jsonwebtoken");
const secretKey = "Mi llave secreta";

app.use(express.static("public"));

//? Cliente
app.get("/", (req, res) => {
  res.send(__dirname + "index.html");
});

//? Autentificacion
app.get("/SignIn", (req, res) => {
  const { email, password } = req.query;
  const user = users.results.find(
    (u) => u.email == email && u.password == password
  );
  if (user) {
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 120,
        data: user,
      },
      secretKey
    );
    res.send(`
      ${email}
      <a href="/Secret?token=${token}"> <p> Ruta Restringida </p> </a>
      <script>
      localStorage.setItem('token', JSON.stringify("${token}"))
      </script>
      `);
  } else {
    res.send("Usuario o contrasena incorrecta");
  }
});

//? Ruta restringida
app.get("/Secret", (req, res) => {
  const { token } = req.query;
  jwt.verify(token, secretKey, (err, decoded) => {
    err
      ? res.status(401).send({
          error: "401 No Autorizado",
          message: err.message,
        })
      : res.send(`Bienvenido ${decoded.data.email}`);
  });
});

app.listen(3000, () => console.log(`Listening to port 3000`));
