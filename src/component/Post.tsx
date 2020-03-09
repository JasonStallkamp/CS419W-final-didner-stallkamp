import User from './User'
export default interface Post
{
    ID: String;
    author: User;
    title: string;
    prompt: String;
    body: String;
    tags: String[];
} 