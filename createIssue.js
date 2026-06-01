import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const GITHUB_REPO = 'ConorMaley/conor-blog';

const alias = process.argv[2];
if (!alias) {
    console.error('Usage: node createIssue.js <post-alias>');
    console.error('Example: node createIssue.js 3_ai-what-is-important');
    process.exit(1);
}

const token = process.env.GITHUB_TOKEN;
if (!token) {
    console.error('Error: GITHUB_TOKEN environment variable is required');
    process.exit(1);
}

const filePath = path.join(__dirname, 'blog', `${alias}.md`);
if (!fs.existsSync(filePath)) {
    console.error(`Error: blog/${alias}.md not found`);
    process.exit(1);
}

const fileContent = fs.readFileSync(filePath, 'utf-8');
const { data, content } = matter(fileContent);

if (data.githubIssue) {
    console.error(`Error: ${alias} already has githubIssue: ${data.githubIssue}`);
    process.exit(1);
}

const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'conor-blog',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        title: `Comments: ${data.title}`,
        body: `Comments for [${data.title}](https://cmaley.dev/blog/${alias})`,
    }),
});

if (!response.ok) {
    const error = await response.json();
    console.error('Error creating issue:', error.message);
    process.exit(1);
}

const issue = await response.json();

data.githubIssue = issue.number;
const updatedContent = matter.stringify(content, data);
fs.writeFileSync(filePath, updatedContent, 'utf-8');

console.log(`Created issue #${issue.number}: ${issue.html_url}`);
console.log(`Updated blog/${alias}.md with githubIssue: ${issue.number}`);
