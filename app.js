//jshint esversion: 6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
  title: {
    type: String,
    required: [true, "Please provide a title for the article."]
  },
  content: {
    type: String,
    required: [true, "Content cannot be blank."]
  }
};

const Article = mongoose.model("article", articleSchema);

// const initialArticles = [
//   {
//     "title" : "API",
//     "content" : "API stands for Application Programming Interface. It is a set of subroutine definitions," +
//     " communication protocols, and tools for building software. In general terms, it is a set of clearly defined methods of communication" +
//     " among various components. A good API makes it easier to develop a computer program by providing all the building blocks," +
//     " which are then put together by the programmer."
//   },
//   {
//     "title" : "Bootstrap",
//     "content" : "This is a framework developed by Twitter that contains pre-made front-end templates for web design"
//   },
//   {
//     "title" : "DOM",
//     "content" : "The Document Object Model is like an API for interacting with our HTML"
//   }
// ];

// Article.insertMany(initialArticles, function(err){
//     if(err){
//       console.log(err);
//     } else{
//       console.log("Initial articles inserted successfully");
//     }
// });

/////////////////////////////////////////// Request targeting all articles ///////////////////////////////////////////////////////

app.route("/articles")
.get(function(req, res){
  Article.find({}, function(err, articleResults){
    if(!err){
      res.send(articleResults);
    } else{
      res.send(err);
    }
  });
})
.post(function(req, res){
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err, savedArticle){
    if(!err){
      res.send("Article successfully saved.");
    } else {
      res.send(err);
    }
  });
})
.delete(function(req, res){
  Article.deleteMany({}, function(err, numRows){
    if(!err){
      res.send(`${numRows.n} articles successfully deleted`);
    } else{
      console.log(err);
    }
  });
});

/////////////////////////////////////////// Request targeting specific articles ///////////////////////////////////////////////////////
app.route("/articles/:articleTitle")
.get(function(req, res){
  const articleTitle = req.params.articleTitle;
  Article.findOne({title: articleTitle}, function(err, articleResult){
    if(!err){
      if(articleResult){
        res.send(articleResult);
      } else{
        res.send("No articles found");
      }
    } else {
      res.send(err);
    }
  });
})
.put(function(req, res){
  const articleTitle = req.params.articleTitle;
  Article.update(
    {title: articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err, result){
      if(!err){
        res.send("successfully updated article");
      } else {
        res.send(err);
      }
  });
})
.patch(function(req, res){
  const articleTitle = req.params.articleTitle;
  Article.update(
    {title: articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("successfully updated article");
      } else{
        res.send(err);
      }
    });
})
.delete(function(req, res){
  const articleTitle = req.params.articleTitle;
  Article.deleteOne({title: articleTitle}, function(err, result){
    if(!err){
      res.send(`${result.n} article successfully deleted`);
    } else{
      res.send(err);
    }
  });
});


app.listen(3000, function(){
  console.log("Application is running on port 3000");
});
