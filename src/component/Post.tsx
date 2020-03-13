import {User} from './User'
export default interface Post
{
    id: String;
    authorID: String;
    title: string;
    prompt: String;
    body: String;
    tags: String[];
    creationTime: Date
} 