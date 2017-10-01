//  OpenShift sample Node application
var express = require('express'),
    app     = express(),
    fs      = require('fs'),
    morgan  = require('morgan'),
    mustache = require('mustache'),
    cheerio = require('cheerio'),

bodyParser = require('body-parser'),
jsonParser = bodyParser.json(),
 
    nodemailer = require('nodemailer');

    var urlencodedParser = bodyParser.urlencoded({ extended: false });
    
Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
      mongoPassword = process.env[mongoServiceName + '_PASSWORD']
      mongoUser = process.env[mongoServiceName + '_USER'];

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

  }
}
var db = null,
    dbDetails = new Object();

var initDb = function(callback) {
  if (mongoURL == null) return;

  var mongodb = require('mongodb');
  if (mongodb == null) return;

  mongodb.connect(mongoURL, function(err, conn) {
    if (err) {
      callback(err);
      return;
    }

    db = conn;
    dbDetails.databaseName = db.databaseName;
    dbDetails.url = mongoURLLabel;
    dbDetails.type = 'MongoDB';

    console.log('Connected to MongoDB at: %s', mongoURL);
  });
};
app.use(express.static(__dirname + '/'));
app.get('/', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    var col = db.collection('counts');
    // Create a document with request IP and current time of request
    col.insert({ip: req.ip, date: Date.now()});
    col.count(function(err, count){
      res.render('index.html', { pageCountMessage : count, dbInfo: dbDetails });
    });
  } else {
    res.render('index.html', { pageCountMessage : null});
  }
});

app.get('/pagecount', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    db.collection('counts').count(function(err, count ){
      res.send('{ pageCount: ' + count + '}');
    });
  } else {
    res.send('{ pageCount: -1 }');
  }
});

//======================================CODE from Old Site===========================================

       app.get('/contact',function(req, res) {
        console.log('enter 1');
           
          var content = fs.readFileSync('views/contact.html').toString();
          console.log('enter 2');
    var data ={
            "message":""
            }
    var html = mustache.to_html(content,data);
    console.log('enter 3');
    res.send(html);
      
        });
     app.get('/about', function(req, res) {


            res.setHeader('Content-Type', 'text/html');
            res.send(fs.readFileSync('views/about.html'));
        });
  
   app.get('/subscribe', function(req, res) {


            res.setHeader('Content-Type', 'text/html');
            res.send(fs.readFileSync('views/newsletter.html'));
        });
    
    app.get('/testimonials',function(req, res) {

      var params = {};
      var collection = database.collection('testimonials');
       var content = fs.readFileSync('views/t.html').toString();
      
        collection.find(params).toArray(function(err, docs) {
               var idx = 0;
                var idex = 0;
                var data = {
                    "testimonials" : docs,
                    "idx" : function(){
                        return idx++;
                    },
                    "idex" : function(){
                        return idex++;
                    }
                 };
         
         
          var html = mustache.to_html(content,data);
                   if(req.headers.type && req.headers.type == 'JSON'){
                     html = data;
                   }
                   res.send(html);

             })
       
       
       
       
       
       
      
           // res.setHeader('Content-Type', 'text/html');
            //res.send(fs.readFileSync('views/t.html'));
        });


        app.get('/getClients',function(req, res) {

            var params = {};
            var collection = database.collection('client');
           
            
              collection.find(params).toArray(function(err, docs) {
               var idx = 0;
                var idex = 0;
                var data = {
                    "clients" : docs,
                    "idx" : function(){
                        return idx++;
                    },
                    "idex" : function(){
                        return idex++;
                    }
                 };
                 
                     res.header("Access-Control-Allow-Origin", "*");
                     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
           

                   res.send(data);

             })
             
             
             
             
             
             
            
           // res.setHeader('Content-Type', 'text/html');
            //res.send(fs.readFileSync('views/t.html'));
        });

       app.get('/getClientActivity', function(req, res) {

            
            // var params = {};
                 console.log("In client activity ID >>>>>>>>>>>>"+req.query.id);

                 var o_id = new mongo.ObjectID(req.query.id);

            var params = {"_id":o_id};



            var collection = database.collection('client');

           
            console.log("In client activity");
              collection.find(params).toArray(function(err, docs) {
               var idx = 0;
                var idex = 0;
                var data = {
                    "clients" : docs,
                    "idx" : function(){
                        return idx++;
                    },
                    "idex" : function(){
                        return idex++;
                    }
                 };
                 
                     res.header("Access-Control-Allow-Origin", "*");
                     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
           
                    console.log("In client activity data"+data);
                   res.send(data);

             })
             
             

        });







     app.get('/trainer-videos', function(req, res) {
       
      var params = {};
      var collection = database.collection('trainingyt');
      var content = fs.readFileSync('views/videos.html').toString();

      collection.find(params).sort({"_id":-1}).toArray(function(err, docs) {
               var idx = 0;
                var idex = 0;
                var data = {
                    "videos" : docs,
                    "idx" : function(){
                        return idx++;
                    },
                    "idex" : function(){
                        return idex++;
                    }
                 };
         
         
        var html = mustache.to_html(content,data);
                   if(req.headers.type && req.headers.type == 'JSON'){
                     html = data;
                   }
                   res.send(html);

             })
        });
    
   app.get('/review', function(req, res) {
           
        var content = fs.readFileSync('views/treviews.html').toString();
          var data ={
            "message":""
            }
        var html = mustache.to_html(content,data);
        res.send(html);
      
        });
    
      
   app.get('/thankyou',function(req, res) {
           
        var content = fs.readFileSync('views/thanks.html').toString();
          var data ={
            "message":""
            }
        var html = mustache.to_html(content,data);
        res.send(html);
      
        });  
    
    
     app.get('/s-thankyou',function(req, res) {
           
        var content = fs.readFileSync('views/sthanks.html').toString();
          var data ={
            "message":""
            }
        var html = mustache.to_html(content,data);
        res.send(html);
      
        });  
      
      
    
     app.get('/promotions',function(req, res) {
           
        var content = fs.readFileSync('views/promotions.html').toString();
          var data ={
            "message":""
            }
        var html = mustache.to_html(content,data);
        res.send(html);
      
        });    
    
    app.get('/youtubeDataFeed', function(req, res) {
        var newHtml;
        try{

          //for(var i=0;i<configModule.getChannels().length;i++){
            var collection = database.collection('trainingyt');
              request('https://www.youtube.com/channel/UCG7vl3IncjRSiLkhxtkB_4g/videos?shelf_id=0&view=0&sort=dd', function (error, response, html) {
          

                    var $ = cheerio.load(html);
                    //var linkContent = ""
                    links = $('a');
                     $(links).each(function(i, link){
                      var href = $(link).attr('href');
                      var text = $(link).text();
                      text = text.replace(new RegExp('\n', 'g'), '')
                      text = text.trim();
                      if(href !=undefined && href.indexOf('watch') != -1){
                        //linkContent = linkContent+ $(link).text() + ':' + href+ '<br>';
                        var youtubeid=href.substring(href.lastIndexOf("v=")+2,href.lastIndexOf("v=")+13);
                        //youtubeid=youtubeid.substring(0,youtubeid.lastIndexOf("&index"));
                        //linkContent = linkContent+ $(link).text() + ':' + youtubeid+ '<br>';
            
             console.log("youtube id"+youtubeid);
                        if(youtubeid && text){
                          var document = {'name':text.replace('\n',''), 'youtubeid':youtubeid};
                          collection.insert(document, {w:1}, function(err, result) {});
                        }
                      }
                       console.log($(link).text() + ':\n  ' + $(link).attr('href'));
                     });



              });

         //}
           res.send('Done');
          }catch(e){
            res.send("error");
          }
    });


//============================================================================================

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
