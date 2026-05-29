import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import { Resend } from 'resend';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { PORT, RESEND_API_KEY } = process.env;

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
            updatedDate: data.updatedDate,
            createdDate: data.createdDate,
            content: htmlContent,
            fileAlias: fileName.replace('.md', ''),
        };
    });

    res.render('home', {
        title: 'Home - Conor\'s Blog',
        posts: mdBlogPosts // Pass the posts data
    });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About - Conor\'s Blog' });
});

app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact - Conor\'s Blog', success: false });
});

app.post('/contact', async (req, res) => {
    const { name, email, message, website } = req.body;
    if (website) {
        // Honeypot triggered — silently succeed so bots don't know they were blocked
        return res.render('contact', { title: 'Contact - Conor\'s Blog', success: true });
    }
    const resend = new Resend(RESEND_API_KEY);
    await resend.emails.send({
        from: 'Contact Form <contact@cmaley.dev>',
        to: 'maleyconor@gmail.com',
        replyTo: email,
        subject: `New message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });
    res.render('contact', { title: 'Contact - Conor\'s Blog', success: true });
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
            updatedDate: data.updatedDate,
            createdDate: data.createdDate,
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