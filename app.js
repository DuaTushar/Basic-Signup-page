const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");


const app = express();

//express.static is used to use your local files in app.js
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/signUp.html");
});

app.post("/", function(req,res){
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const emailId = req.body.email;

    //console.log(firstName, lastName, emailId);

    const data ={
        members : [
            {
                email_address : emailId,
                status : "subscribed",
                merge_fields : {
                    FNAME : firstName,
                    LNAME : lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);
 //reponse in function is response from mailchimp

    const url = "https://us1.api.mailchimp.com/3.0/lists/17633a5906";
    const options = {
        method: "POST",
        auth: "darkshark14:8c71b5f00eb5b72431441e08dfa17e54-us1"
    }

    const request = https.request(url, options, function(response){

        if(response.statusCode === 200){
            res.sendFile(__dirname + "/sucess.html");
        }else{
            res.sendFile(__dirname + "/failure.html");
        }



        response.on("data",function(data){
            console.log(JSON.parse(data));
        })

    })

    request.write(jsonData);
    request.end();

});


app.post("/failure", function(req,res){
    res.redirect("/");
})
//process.env.PORT is for heroku
app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000");
});


//API Key
//8c71b5f00eb5b72431441e08dfa17e54-us1

//List ID
//17633a5906        