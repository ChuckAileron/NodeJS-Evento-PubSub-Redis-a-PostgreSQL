const redis = require('./../services/redisService');

module.exports = {
    getProducto: async (req, res, next) => {
        const key = req.params.sku;
        let value = await redis.getData(key);
        console.log(`Producto sku: ${key}, price: ${value} encontrado en Redis`);
        res.status(200).send('OK');
        next();
    },

    setProducto: async (req, res) => {
        await redis.setData(req.body.sku, req.body.price);
        res.status(201).send(`Producto sku: ${req.body.sku}, price: ${req.body.price} insertado en Redis`);
    },

    deleteProducto: async (req, res) => {
        const key = req.params.sku;
        await redis.delData(key);
        console.log(`Producto sku: ${key} eliminado de Redis`);
        res.status(200).send(query);
    },
    
    publisherEvent: async (req, res) => {
        try{
            //Inserta nuevo dato a Redis
            await redis.setData(req.body.sku, req.body.price);
            //Publica la key al canal "sku"
            redis.redisPublisher.publish('sku', req.body.sku);
            res.status(201).send(`Producto sku: ${req.body.sku}, price: ${req.body.price} insertado en Redis`);
        } catch (err) {
            console.log(err);
        }
    },
};