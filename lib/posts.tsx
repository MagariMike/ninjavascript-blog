import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import {remark} from 'remark'
import html from 'remark-html'


const postsDirectory = path.join(process.cwd(), 'blogposts');

export function getSortedPostsData(){
	const fileNames = fs.readdirSync(postsDirectory);
	// get file names under /posts
	const allPostsData = fileNames.map((fileName) => {
		const id = fileName.replace(/\.md$/, '');
		// read markdown file as string
		const fullPath = path.join(postsDirectory, fileName);
		const fileContents = fs.readFileSync(fullPath, 'utf8');
		// use grey-matter to parse the post metadata section
		const matterResult = matter(fileContents);

		const blogPost: BlogPost = {
			id,
			title: matterResult.data.title,
			date: matterResult.data.date
		}
		// combine data with id
		return blogPost
	})
	// sort posts by data
	return allPostsData.sort((a, b) => a.date < b.date ? 1 : -1)
}

export async function getPostData(id: string){
	const fullPath = path.join(postsDirectory, `${id}.md`);
	const fileContents = fs.readFileSync(fullPath, 'utf8');

	//use gray-matter to parse the post metadata section

	const matterResult = matter(fileContents);

	const processedContent = await remark()
	.use(html)
	.process(matterResult.content);

	const contentHTML = processedContent.toString();

	const blogPostWithHTML: BlogPost & { contentHTML: string} = {
		id,
		title: matterResult.data.title,
		date: matterResult.data.date,
		contentHTML,
	} 

	// combine the data with the id
	return blogPostWithHTML
}