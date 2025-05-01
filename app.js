import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();

const { PORT } = process.env;

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('home', { posts: [] }); // Pass blog posts here
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});