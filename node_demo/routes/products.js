var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var products = mongoose.model('products');

/*
 * Shows the products
 * Added On: 
 * Updated On: 
 * @return Response
 */
router.get('/', function (req, res, next)
{
    try {
        // find all products
        products.find({}).exec(function (error, data) {
            if (!error)
                res.status(200).send({message: "Success", status: 1, data: data});
            else
                return next(error);
        });
    } catch (err) {
        return next(err);
    }
});

/*
 * Shows the specific product
 * Added On: 
 * Updated On: 
 * @return Response
 */
router.get('/:id', function (req, res, next)
{
    try {
        // find specific product
        products.findOne({_id:req.params.id}).exec(function (error, data) {
            if (!error)
                res.status(200).send({message: "Success", status: 1, data: data});
            else
                return next(error);
        });
    } catch (err) {
        return next(err);
    }
});

/*
 * Add the products
 * Added On: 
 * Updated On: 
 * @return Response
 */
router.post('/', function (req, res, next)
{
    try {
        var product_item = new products(req.body)
        // find all products
        product_item.save(function (error, data) {
            if (!error)
                res.status(200).send({message: "Success", status: 1, data: data});
            else
                return next(error);
        });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
