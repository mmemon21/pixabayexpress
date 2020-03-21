var keywords = ["cars", "sports", "animals", "people", "places", "castles", "otters"];

const express = require("express");
const app = express();
const bodyparser = require('body-parser');
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = require("jquery")(window);
app.set("view engine", "ejs");
app.use(express.static("public")); //folder for images, css, js
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

const request = require('request');


//routes
app.get("/", async function(req, res){
     let randomKeyword = Math.floor(Math.random() * 7);

     let or = req.query.orientation;

     let parsedData = await getImages(keywords[randomKeyword], or);


     res.render("index", {"images":parsedData});

});

app.get("/results", async function(req, res){

    //console.dir(req);
    let keyword = req.query.keyword; 
    let or = req.query.orientation;

    let parsedData = await getImages(keyword, or);

    res.render("results", {"images":parsedData});
   
});


function getImages(keyword, orientation){

    return new Promise( function(resolve, reject){
        request('https://pixabay.com/api/?key=15448688-20de9241e191f9396c50497fa&q='
          + keyword + "&orientation=" + orientation,
                 function (error, response, body) {

            if (!error && response.statusCode == 200  ) { //no issues in the request

                 let parsedData = JSON.parse(body); //converts string to JSON

                 resolve(parsedData);

            
            } else {
                reject(error);
                console.log(response.statusCode);
                console.log(error);
            }

          });

    });

}

app.listen(process.env.PORT || 3000, function(){
    console.log("Server has been started");
});

