import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const blogDir = path.join(__dirname, 'blog');

function getGitCommitDate(filePath) {
    try {
        const commitDate = execSync(`git log -1 --format=%ci -- ${filePath}`, { encoding: 'utf-8' }).trim();
        return new Date(commitDate).toISOString();
    } catch (error) {
        console.error(`Error fetching commit date for ${filePath}:`, error);
        return null;
    }
}

function getGitCreatedDate(filePath) {
    try {
        const createdDate = execSync(`git log --diff-filter=A --format=%ci -- ${filePath}`, { encoding: 'utf-8' }).trim();
        return new Date(createdDate).toISOString();
    } catch (error) {
        console.error(`Error fetching created date for ${filePath}:`, error);
        return null;
    }
}

function updateBlogPostDates() {
    const blogFiles = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'));

    blogFiles.forEach(fileName => {
        const filePath = path.join(blogDir, fileName);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);

        const createdDate = getGitCreatedDate(filePath);
        const updatedDate = getGitCommitDate(filePath);

        if (createdDate) {
            data.createdDate = createdDate;
        }
        if (updatedDate) {
            data.updatedDate = updatedDate;
        }

        const updatedContent = matter.stringify(content, data);
        fs.writeFileSync(filePath, updatedContent, 'utf-8');
        console.log(`Updated metadata for ${fileName}`);
    });
}

updateBlogPostDates();