const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const logger = require('./middleware/logger');
const members = require('./Members');

const app = express();

//Init middleware
//app.use(logger);

// app.get('/', (req, res) => {
//     res.send('<h1>Hello there</h1>');
// })


// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// })

//handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


//Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

//Homepage route
app.get('/', (req, res) => res.render('index', {
    title: 'Member App',
    members
    })
);

app.post('/contact', (req, res) => {
	//res.send(req.body);
	//res.send(req.header('Content-Type'));
	if (!req.body.name) {
		return res.status(400).send('Name is required');
	}
	
	//Database Stuff
	res.status(201).send(`Thank you ${req.body.name}`);
});

app.post('/login', (req, res) => {
	if (!req.header('x-auth-token')) {
		return res.status(400).send('No token');
	}
	
	if (req.header('x-auth-token') !== '123456') {
		return res.status(401).send('Not authorized');
	}
	
	res.send('Logged in');
});

app.put('/post/:id', (req, res) => {
	//Database Stuff
	res.json({
		id:req.params.id,
		title: req.body.title
	});
});

app.delete('/post/:id', (req, res) => {
	//Database Stuff
	res.json({ msg:`Post ${req.params.id} deleted` });
});

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Members API routes
app.use('/api/members', require('./routes/api/members'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));