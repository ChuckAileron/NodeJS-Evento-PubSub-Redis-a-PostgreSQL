//Modulos
const express = require('express');
const bodyParser = require('body-parser');
const { redisClient, redisSubscriber, subscriberEvent } = require('./services/redisService');

//Inicializaciones
const app = express();

//Settings
app.set('port', process.env.PORT || 4000); //Definir puerto

//Middlewares
app.use(bodyParser.json()); // Parse application/json

//Conectar Redis
redisClient.on('error', function (err) {
    console.log('Error ' + err);
})
//Conectar suscriptor Redis y evento al llegar mensaje
redisSubscriber.on('message', async function (channel, message) {
    //Lee el mensaje
    const key = message;
    console.log("El producto '" + message + "' enviado desde canal '" + channel + "' llego");
    return await subscriberEvent(key); //Llamada al evento
})
redisSubscriber.subscribe("sku"); //Suscriptor Redis escuchando al canal "sku",

//Routes
app.use(require('./routes/routes'));

//Exportar metodos de express
module.exports = app;