import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { PORT } = process.env;

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    const mdBlogPostFileNames = fs.readdirSync(`${__dirname}/blog`).filter(file => file.endsWith('.md'));
    const mdBlogPosts = mdBlogPostFileNames.map(fileName => {
        const filePath = `${__dirname}/blog/${fileName}`;
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);
        const htmlContent = marked.parse(content.substring(0, 100) + '...');
        
        return {
            title: data.title,
            date: data.date,
            content: htmlContent,
            fileAlias: fileName.replace('.md', ''),
        };
    });

    res.render('home', {
        title: 'Home - Conor\'s Blog',
        posts: mdBlogPosts // Pass the posts data
    });
});

app.get('/blog/:postAlias', (req, res) => {
    const { postAlias } = req.params;
    const filePath = `${__dirname}/blog/${postAlias}.md`;
    if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);
        const htmlContent = marked.parse(content);
        return res.render('post', {
            title: data.title,
            date: data.date,
            content: htmlContent,
            postAlias
        });
    }
    return res.status(404).send('Post not found');
});

app.use((req, res) => {
    res.status(404).render('404', { title: 'Page Not Found' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});