const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const { connectionDB } = require("./postgress/postgres");
const router = require("./routes/userRoutes");
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
dotenv.config();

const app = express();
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Node Js with Postgress sql test project',
            version: '1.0.0',
        },
        servers: [
            {
                url: 'http://localhost:5000/api'
            }
        ],
    },
    apis: ['./apiDocs/apiDocs.yaml'], // files containing annotations as above
}

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.status(200).send({ message: 'Welcome to the MEN-REST-API' });
})

app.use('/api', router);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})

connectionDB();

module.exports = server