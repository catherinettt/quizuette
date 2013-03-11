var express = require('express');
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade'); 
app.set('view options', { layout: false });
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + "/public"));

app.get('/', function(req, res){
  // res.send('hello world');
  res.render('index', function(err, rendered){
    res.writeHead(200, {'Content-Type':'text/html'});
    res.end(rendered);  
  })
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});