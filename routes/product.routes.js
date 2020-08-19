const express = require("express");
const router = express.Router();
const http = require('http');

const Product= require('../models/Product');


//@type - POST
//@route -  /api/product
//@desc - route for submit new product
//@access - PRIVATE
router.post("", (req, res) => { 
    const newProduct = new Product({
        nom: req.body.nom,
        prix: req.body.prix,
        qte: req.body.qte,
    });

    newProduct.save()
        .then(prod => {
            res.json(prod)
        })
        .catch(err => console.log("Unable to save product to database", err));
})


//@type - DELETE
//@route -  /api/product/:prod_id
//@desc - route for deleting a specific product
//@access - PRIVATE
router.delete("/:prod_id", (req, res) => {
    Product.find({ _id: req.params.prod_id })
        .then(prod => {
            if (!prod) {
                return res.json({ "NoProd": "Product Not found" });
            }
            
            Product.findOneAndRemove({ _id: req.params.prod_id})
                .then(() => res.json({ Delete: "Deleted Successfully" }))
                .catch(err => console.log("Problem in removing Product", err));                     
        })
        .catch(err => console.log("Problem in Deleting a specific Product", err));
});



//@type - GET
//@route -  /api/product/:id
//@desc - route for retreiving  product by its ID
//@access - PRIVATE
router.get("/:id", (req, res) => {
 

    Product.find({ _id: req.params.id })
    .then(prod => {
        if (!prod) {
            return res.json({ "NoTProd": "Product Not found" });
        }
        
            res.send(prod);
    })
  });

//@type - GET
//@route -  /api/product
//@desc - route for showing all products paginated
//@access - PUBLIC
router.get("/", async (req, res) => {
    // destructure page and limit and set default values
    const { page = 1, limit = 6 } = req.query;
  
    try {
      // execute query with page and limit values
      const products = await Product.find()
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort( {date: 'desc'})
        .exec();
  
      // get total documents in the Forum collection 
      const count = await Product.countDocuments();
  
      // return response with products, total pages, and current page
      res.json({
        products,
          totalPages: Math.ceil(count / limit),
          currentPage: page
      });
    } catch (err) {
      console.error(err.message);
    }
  });


  //@type - PUT
//@route -  /api/product/:id
//@desc - route for updating product
//@access - PRIVATE
router.put("/:id",/* authorize,*/ (req, res) => {
    Product.findById(req.params.id)
        .then(prod => {
            const newProd = {
                nom: req.body.nom,
                prix: req.body.prix,
                qte: req.body.qte
            };
            prod.nom=newProd.nom;
            prod.prix=newProd.prix;
            prod.qte=newProd.qte;
            prod.save()
                .then(prod => {
                    res.json(prod)
                })
                .catch(err => console.log("Error in updating product", err));
        })
        .catch(err => console.log("Problem in submitting product", err));
  })


module.exports = router;