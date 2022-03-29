const express = require('express');
const cors = require('cors');
const dbConfig = require('./app/config/db.config');

const app = express();

var corsOptions = {
    origin: "http://localhost:3000"
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

const db = require('./app/models');
const Role = db.role;

//Konekcija na bazu
db.monogoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to MongoDB");
    initial();
}).catch(err => {
    console.error("Connection error", err);
    proccess.exit();
});

//Rute
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/product.routes')(app);

//Definisnanje porta
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//Inicijalna funkcija za dodavanje uloga
function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({ name: "user" }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("Added 'user' to roles collection");
            });

            new Role({ name: "admin" }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("Added 'admin' to roles collection");
            });
        }
    });
};