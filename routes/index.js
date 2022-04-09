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
  res.status(200).json(OrderArray);
});


/* Add one new Order */
router.post('/AddOrder', function(req, res) {
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
