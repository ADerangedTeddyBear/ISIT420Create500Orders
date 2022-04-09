
let orderArray = [];

let aStoreID = [98053, 98007, 98077, 98055, 98011, 98046];
let aCdID = [123456, 123654, 321456, 321654, 654123, 654321, 543216, 354126, 621453, 623451];
let aPricePaid = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

// define a constructor to create order objects
let OrderObject = function (pStoreID, pSalesPersonID, pCdID, pPricePaid, pDate) {
    this.StoreID = pStoreID;
    this.SalesPersonID = pSalesPersonID;
    this.CdID = pCdID;
    this.PricePaid = pPricePaid;
    this.Date = pDate;
}



let selectedGenre = "not selected";

document.addEventListener("DOMContentLoaded", function () {

    createList();

// add button events ************************************************************************
    document.getElementById("buttonCreate").addEventListener("click", function(){
        let currStoreID = aStoreID[Math.floor(Math.random() * 5)];
        let currSalesPersonID = Math.floor((Math.random() * 4)+1);
        if (currStoreID == 98007){
            //5-8
            currSalesPersonID += 4;            
        } else if (currStoreID == 98077){
            //9-12
            currSalesPersonID += 8;
        } else if (currStoreID == 98055){
            //13-16
            currSalesPersonID += 12;
        } else if (currStoreID == 98011){
            //17-20
            currSalesPersonID += 16;
        } else if (currStoreID == 98046){
            //21-24
            currSalesPersonID += 20;
        } else {
            //1-4

        }
        let currCdID = aCdID[Math.floor(Math.random() * 10)];
        let currPricePaid = aPricePaid[Math.floor(Math.random() * 11)];
        let currDate = Date.now();

        let newOrder = new OrderObject(currStoreID, currSalesPersonID, currCdID, currPricePaid, currDate);
        document.getElementById("randomStoreID").innerHTML = currStoreID.toString();
        document.getElementById("randomSalesPersonID").innerHTML = currSalesPersonID.toString();
        document.getElementById("randomCdID").innerHTML = currCdID.toString();
        document.getElementById("randomPricePaid").innerHTML = currPricePaid.toString();
        document.getElementById("randomDate").innerHTML = currDate.toString();
        //currently this only saves to a new OrderObject and does not write anywhere
    });    


    document.getElementById("buttonSubmitOne").addEventListener("click", function () {
        let currStoreID = aStoreID[Math.floor(Math.random() * 5)];
        let currSalesPersonID = Math.floor((Math.random() * 4)+1);
        if (currStoreID == 98007){
            //5-8
            currSalesPersonID += 4;            
        } else if (currStoreID == 98077){
            //9-12
            currSalesPersonID += 8;
        } else if (currStoreID == 98055){
            //13-16
            currSalesPersonID += 12;
        } else if (currStoreID == 98011){
            //17-20
            currSalesPersonID += 16;
        } else if (currStoreID == 98046){
            //21-24
            currSalesPersonID += 20;
        } else {
            //1-4

        }
        let currCdID = aCdID[Math.floor(Math.random() * 10)];
        let currPricePaid = aPricePaid[Math.floor(Math.random() * 11)];
        let currDate = Date.now();

        let newOrder = new OrderObject(currStoreID, currSalesPersonID, currCdID, currPricePaid, currDate);
        
        //write the new order object into the .json file
        fetch('/AddOrder', {
            method: "POST",
            body: JSON.stringify(newOrder),
            headers: {"Content-type": "application/json; charset=UTF-8"}
            })
            .then(response => response.json()) 
            .then(json => console.log(json),
            createList()
            )
            .catch(err => console.log(err));
    
        // $.ajax({
        //     url : "/AddOrder",
        //     type: "POST",
        //     data: JSON.stringify(newOrder),
        //     contentType: "application/json; charset=utf-8",
        //      success: function (result) {
        //         console.log(result);
        //         createList();
        //     }
        // });
       
    });

    document.getElementById("buttonSubmit500").addEventListener("click", function () {
        //sets the current time for the first order as a benchmark
        let currDate = Date.now();

        //loops 500 times generating orders with the same method as above
        for(let i = 0; i < 500; i++){
            let currStoreID = aStoreID[Math.floor(Math.random() * 5)];
            let currSalesPersonID = Math.floor((Math.random() * 4)+1);
            if (currStoreID == 98007){
                //5-8
                currSalesPersonID += 4;            
            } else if (currStoreID == 98077){
                //9-12
                currSalesPersonID += 8;
            } else if (currStoreID == 98055){
                //13-16
                currSalesPersonID += 12;
            } else if (currStoreID == 98011){
                //17-20
                currSalesPersonID += 16;
            } else if (currStoreID == 98046){
                //21-24
                currSalesPersonID += 20;
            } else {
                //1-4
    
            }
            let currCdID = aCdID[Math.floor(Math.random() * 10)];
            let currPricePaid = aPricePaid[Math.floor(Math.random() * 11)];
            
            //the current date from above has 5-30 minutes added onto it randomly per cycle
            currDate += Math.floor((Math.random() * 25001) + 5000);
            let newOrder = new OrderObject(currStoreID, currSalesPersonID, currCdID, currPricePaid, currDate);
            
            //write the new order object into the .json file and hopefully it doesn't overwrite itself
            fetch('/AddOrder', {
                method: "POST",
                body: JSON.stringify(newOrder),
                headers: {"Content-type": "application/json; charset=UTF-8"}
                })
                .then(response => response.json()) 
                .then(json => console.log(json),
                createList()
                )
                .catch(err => console.log(err));
        }      
    });

    document.getElementById("buttonDelete").addEventListener("click", function () {
        deleteMovie(document.getElementById("deleteID").value);      
    });
    
    document.getElementById("buttonClear").addEventListener("click", function () {
        document.getElementById("title").value = "";
        document.getElementById("year").value = "";
    });

    $(document).bind("change", "#select-genre", function (event, ui) {
        selectedGenre = $('#select-genre').val();
    });

  

});  
// end of wait until document has loaded event  *************************************************************************


function createList() {
// update local array from server

    fetch('/getAllMovies')
    // Handle success
    .then(response => response.json())  // get the data out of the response object
    .then( responseData => fillUL(responseData))    //update our array and li's
    .catch(err => console.log('Request Failed', err)); // Catch errors

    // $.get("/getAllMovies", function(data, status){  // AJAX get
    //     movieArray = data;  // put the returned server json data into our local array
        
    //       // clear prior data
    //     var divMovieList = document.getElementById("divMovieList");
    //     while (divMovieList.firstChild) {    // remove any old data so don't get duplicates
    //         divMovieList.removeChild(divMovieList.firstChild);
    //     };

    //     var ul = document.createElement('ul');

    //     movieArray.forEach(function (element,) {   // use handy array forEach method
    //         var li = document.createElement('li');
    //         li.innerHTML = element.ID + ":  &nbsp &nbsp  &nbsp &nbsp " + 
    //         element.Title + "  &nbsp &nbsp  &nbsp &nbsp "  
    //         + element.Year + " &nbsp &nbsp  &nbsp &nbsp  " + element.Genre;
    //         ul.appendChild(li);
    //     });
    //     divMovieList.appendChild(ul)

    // });
};

function fillUL(data) {
        // clear prior data
    var divMovieList = document.getElementById("divMovieList");
    while (divMovieList.firstChild) {    // remove any old data so don't get duplicates
        divMovieList.removeChild(divMovieList.firstChild);
    };

    var ul = document.createElement('ul');
    movieArray = data;
    movieArray.forEach(function (element,) {   // use handy array forEach method
        var li = document.createElement('li');
        li.innerHTML = element.ID + ":  &nbsp &nbsp  &nbsp &nbsp " + 
        element.Title + "  &nbsp &nbsp  &nbsp &nbsp "  
        + element.Year + " &nbsp &nbsp  &nbsp &nbsp  " + element.Genre;
        ul.appendChild(li);
    });
    divMovieList.appendChild(ul)
}

function deleteMovie(ID) {

    fetch('/DeleteMovie/' + ID, {
        method: "DELETE",
       // body: JSON.stringify(_data),
        headers: {"Content-type": "application/json; charset=UTF-8"}
      })
      .then(response => response.json()) 
      .then(json => console.log(json))
      .catch(err => console.log(err));



    // $.ajax({
    //     type: "DELETE",
    //     url: "/DeleteMovie/" +ID,
    //     success: function(result){
    //         alert(result);
    //         createList();
    //     },
    //     error: function (xhr, textStatus, errorThrown) {  
    //         alert("Server could not delete Movie with ID " + ID)
    //     }  
    // });
   
}


  
