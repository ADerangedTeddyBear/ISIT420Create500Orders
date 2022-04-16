let x = 2;
var express = require('express');
var router = express.Router();
var fs = require("fs");

// start by creating data
let OrderArray = [];

// define a constructor to create order objects
let OrderObject = function (pStoreID, pSalesPersonID, pCdID, pPricePaid, pDate) {
    this.StoreID = pStoreID;
    this.SalesPersonID = pSalesPersonID;
    this.CdID = pCdID;
    this.PricePaid = pPricePaid;
    this.Date = pDate;
}

// mongoose support
const mongoose = require("mongoose");
const OrderSchema = require('../orderSchema');

const dbURI = "mongodb+srv://bcuser:bcuser@kyucluster.y886w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

/*mongoose.set('useFindAndModify', false);

const options = {
  reconnectTries: Number.MAX_VALUE,
  poolSize: 10
};*/

mongoose.connect(dbURI).then(
  () => {
    console.log("Database connection established!");
  },
  err => {
    console.log("Error connecting Database instance due to: ", err);
  }
);

const connection = mongoose.connection;



// my file management code, embedded in an object
fileManager  = {
  read: function() {
      // has extra code to add 4 movies if and only if the file is empty
      const stat = fs.statSync('orderData.json');
      if (stat.size !== 0) {
          var rawdata = fs.readFileSync('orderData.json'); // read disk file
          OrderArray = JSON.parse(rawdata);  // turn the file data into JSON format and overwrite our array
      }
      else {
          // make up 3 for testing
          // ServerMovieArray.push(new MovieObject("Moonstruck", 1981, "Drama"));
          // ServerMovieArray.push(new MovieObject("Wild At Heart", 1982, "Drama"));
          // ServerMovieArray.push(new MovieObject("Raising Arizona", 1983, "Comedy"));
          // ServerMovieArray.push(new MovieObject("USS Indianapolis", 2016, "Drama"));
          fileManager.write();
      }
  },
  write: function() {
      let data = JSON.stringify(OrderArray);    // take our object data and make it writeable
      fs.writeFileSync('orderData.json', data);  // write it
  },
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html');
});

/* GET all Order data */
router.get('/getAllOrders', function(req, res) {
  fileManager.read();
  console.log(OrderArray.length);
  res.status(200).json(OrderArray);
});

//Get all order data where SalesPersonID is 1 and PricePaid is 14
router.get('/getSpecificOrders', function(req, res) {
  OrderSchema.find(  {SalesPersonID: 1, PricePaid: 14 }).exec(function(err, AllOrders) {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    console.log(AllOrders);
    res.status(200).json(AllOrders);
  });
});

//Get all order data where CdID contains 123 and PricePaid is at least 10
router.get('/getSpecificOrders2', function(req, res) {
  OrderSchema.find(  {StoreID: 98077, PricePaid: {$gte: 13} }).exec(function(err, AllOrders) {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    console.log(AllOrders);
    res.status(200).json(AllOrders);
  });
});

// router.get('/getSpecificOrders', function(req, res) {
//   OrderSchema.find(  {PricePaid: 14 }  , (err, AllOrders) => {
//     if (err) {
//       console.log(err);
//       res.status(500).send(err);
//     }
//     console.log(AllOrders);
//     res.status(200).json(AllOrders);
//   });
// });

/* Add one new Order 
currently deprecated due to this calling filemanager instead of mongoose*/
router.post('/AddOrderOld', function(req, res) {
  const newOrder = req.body;  // get the object from the req object sent from browser
  console.log(newOrder);
  OrderArray.push(newOrder);  // add it to our "DB"  (array)
  fileManager.write();
  // prepare a reply to the browser
  var response = {
    status  : 200,
    success : 'Added Successfully'
  }
  res.end(JSON.stringify(response)); // send reply
});

/* Alternative write one new order to mongoDB*/
router.post('/AddOrder', function(req, res) {
  let oneNewOrder = new OrderSchema(req.body);
  console.log(req.body);
  oneNewOrder.save((err, todo) => {
    if (err) {
      res.status(500).send(err);
    } else {
      var response = {
        status  : 200,
        success : 'Added Successfully'
      }
      res.end(JSON.stringify(response));
    }
  })
})



// clear mongoose db
router.delete('/DeleteOrders', (req, res) => {
  console.log(`Our Current Database Name : ${connection.db.databaseName}`);
  mongoose.connection.db.dropDatabase();
  /*OrderSchema.remove({}, function(err){
    console.log('collection removed');
  });*/
});

// delete movie

router.delete('/DeleteMovie/:ID', (req, res) => {
  const ID = req.params.ID;
  let found = false;
  console.log(ID);    

  for(var i = 0; i < OrderArray.length; i++) // find the match
  {
      if(OrderArray[i].ID === ID){
        OrderArray.splice(i,1);  // remove object from array
          found = true;
          fileManager.write();
          break;
      }
  }

  if (!found) {
    console.log("not found");
    return res.status(500).json({
      status: "error"
    });
  } else {
    var response = {
      status  : 200,
      success : 'Movie ' + ID + ' deleted!'
    }
    res.end(JSON.stringify(response)); // send reply
  }
});


module.exports = router;
