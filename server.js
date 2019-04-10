var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var flash = require('express-flash');
var session = require('express-session');

mongoose.connect('mongodb://localhost/quoting_dojo', {useNewUrlParser:true});

app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'keyboard',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))

var QuoteSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 3},
    quote: {type: String, required: true, minlength: 3}
}, {timestamps: true});
mongoose.model('Quote', QuoteSchema);
var Quote = mongoose.model('Quote');

//Root route
app.get('/', function(req,res){
    res.render('index');
})

//Add_Quote POST route
app.post('/add_quote', function(req,res){
    console.log("POST DATA", req.body);
    var quote = new Quote({name: req.body.name, quote: req.body.quote});

    quote.save(function(err) {
        if(err) {
            console.log('something went wrong', err);
            for(var key in err.errors){
                req.flash('invalid_quote', err.errors[key].message);
            }
            res.redirect('/');
        } else {
            console.log('successfully added a quote!');
            res.redirect('/quotes');
        }
    })
})

//Quotes page route
app.get('/quotes', function(req,res){

    Quote.find({}, function(err,quotes){
        if(err) {
            console.log('something went wrong wile retrieving Quotes');
        } else {
            console.log('successfully retrieved all Quotes!');
            console.log('----------------------------');
            console.log(quotes);
            console.log('----------------------------');
            res.render('quotes', {quotes: quotes});
        }
    })
})

app.listen(8000, function() {
    console.log("listening on port 8000");
})