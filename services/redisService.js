// Modulos
const asyncRedis = require("async-redis");
const db = require('./../services/postgresService');

// Environment Variables
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || '';

//Configuraciones para Redis
const config = {
    port: REDIS_PORT,
    host: REDIS_HOST,
    pass: REDIS_PASSWORD
};

//Cliente principal
const redisClient = asyncRedis.createClient(config);
//Publisher
const redisPublisher = asyncRedis.createClient(config);
//Suscriber
const redisSubscriber = asyncRedis.createClient(config);

module.exports = {
    redisClient: redisClient,
    redisPublisher: redisPublisher,
    redisSubscriber: redisSubscriber,
    //Buscar value segun una key en Redis
    getData: async (key) => {
        try {
            return await module.exports.redisClient.get(key);
        } catch (err) { return null; }
    },
    //Agregar dato en Redis
    setData: async (key, value) => {
        try {
            return await module.exports.redisClient.set(key, value);
        } catch (err) { return null; }
    },
    //Eliminar dato en Redis
    delData: async(key) => {
        try{
            return await module.exports.redisClient.del(key);
        } catch(err){ return null; }
    },
    //Evento luego de llegado el mensaje al suscriptor
    subscriberEvent: async(key) => {
        try{
            //Obtiene producto desde redis
            let value = await module.exports.getData(key);
            console.log(`Producto sku: ${key} encontrado en Redis`);

            const producto = await db.getProductoBySKU(key);

            //Revisa si el producto ya esta en base de datos. Si no esta, inserta el producto en la base de datos
            if (producto.length === 0){
                let values = [key, value];
                let query = await db.insertProducto(values);
                console.log('Producto insertado en la base de datos');
                res.status(201).send(query);
            }
            else { // Si existe, actualiza producto en base de datos
                let values = [key, value, key];
                let query = await db.updateProducto(values);
                console.log('Producto actualizado en base de datos');
                res.status(200).send(query);
            }
        } catch (err) {
            console.log(err);
        }
    }
};