import { ApolloServer, gql,} from "apollo-server-micro";
const { DataSource } = require('apollo-datasource');
import {User, UserAuthToken} from '../../component/User'
const bcrypt = require("bcrypt")
var randomstring = require("randomstring");
const fs = require('fs');

import nextCookie from 'next-cookies'
import { serialize } from 'cookie';
import Post from "../../component/Post";

const COOKIE_NAME= "Auth";





class UserDataSource extends DataSource<object>{
  data: Map<String,User>
  constructor(data : User[])
  {
      super(data);
      this.data = new Map<String,User>();
      for(let i = 0; i < data.length; i++)
      {
          this.data.set(data[i].id, data[i])
      }
  }

  getCount(): number
  {
    return Array.from(this.data.values()).length;
  }

  getUserById(id: String)
  {

      return this.data.get(id);
  }
  getUserByName(username: string) : User | undefined
  {
    let value = Array.from(this.data).find(item => item[1].username === username);
    return value != undefined ? value[1] : undefined;
  }
  getUserByEmail(email:string) : User | undefined
  {
    let value = Array.from(this.data).find(item => item[1].email === email);
    return value != undefined ? value[1] : undefined;
  }
}

class PostDataSource extends DataSource<object>{
  data: Map<String, Post>
  constructor(data: Post[])
  {
    super(data);
    this.data = new Map<String,Post>();
    for(let i = 0; i < data.length; i++)
    {
        this.data.set(data[i].id, data[i])
    }
  }
  getPostsByUser(user: User) : Post[]
  {
    return this.getPostByUserId(user.id);
  }
  getPostByUserId(userid: String): Post[]
  {
    return Array.from(this.data.values()).filter((post) => post.authorID === userid)
  }
  getPostByTag(tag: String): Post[]
  {
    return Array.from(this.data.values()).filter(post => post.tags.includes(tag));
  }
  getPostByPostID(postid: String): Post
  {
    return Array.from(this.data.values()).find(post => post.id == postid);
  }

}

class TokenDataSource extends DataSource<object>{
  data: Map<String, UserAuthToken>
  constructor(data: UserAuthToken[])
  {
    super(data);
    this.data = new Map<String,UserAuthToken>();
    for(let i = 0; i < data.length; i++)
    {
        this.data.set(data[i].token, data[i])
    }
  }

  GenerateUserAuth(user: User) : UserAuthToken
  {
    let newToken = {userId:user.id,token:randomstring.generate(24), Expire: "" + new Date().getTime() + 1000 * 60 * 60 * 24 * 30};
    this.data.set(newToken.token,newToken);
    fs.writeFileSync("tokens.json",JSON.stringify(Array.from(this.data.values())))
    return newToken
  }

  GetUserAuthToken(token: string) : UserAuthToken
  {
    return this.data.get(token)
  }

}

const typeDefs = gql`
type User{
  id: String!,
  username: String!,
  email: String!,
  posts: [Post!]!
}

type Post
{
  id: String!,
  author: User,
  title: String!,
  prompt: String!,
  body: String!,
  tags: [String!]
}

type ErrorableOrUserAuthToken
{
  isErrored: Boolean!,
  errorMsg: String,
  token: UserAuthToken
}

type UserAuthToken
{
  token: String!,
  Expire: String!,
}
type LoggedInState
{
  isLoggedIn: Boolean!,
  userid: String,
}

type Query {
  listUsers: [User!]
  login(name: String, password: String) : ErrorableOrUserAuthToken
  isLoggedIn: LoggedInState
  getLatestPosts(max: Int): [Post]
  getPostsByUser(userid: String): [Post]
  getPostByTag(tag: String): [Post]
  getPostByPostID(postid: String): Post
}

type Mutation{
  registerUser(username: String, email: String, password: String) : ErrorableOrUserAuthToken!
  logout: Boolean!
}
`;

if(!fs.existsSync('Users.json'))
{
  fs.writeFileSync('Users.json','[]')
}
let rawdata = fs.readFileSync('Users.json');
let userDataSource = new UserDataSource(JSON.parse(rawdata));

if(!fs.existsSync('Posts.json'))
{
  fs.writeFileSync('Posts.json','[]')
}
rawdata = fs.readFileSync('Posts.json');
let postDataSource = new PostDataSource(JSON.parse(rawdata));

if(!fs.existsSync('tokens.json'))
{
  fs.writeFileSync('tokens.json','[]')
}
rawdata = fs.readFileSync('tokens.json');
let tokenDataSource = new TokenDataSource(JSON.parse(rawdata));

function isAuthTokenValid(token: UserAuthToken) : boolean
{
  let compare = tokenDataSource.GetUserAuthToken(token.token);
  return compare.token === token.token && token.Expire === compare.Expire && token.userId === compare.userId;
}

function isAuthorized(req: any) : boolean
{
  try{
    return isAuthTokenValid(JSON.parse(req.cookies[COOKIE_NAME]));
  }
  catch
  {
    return false;
  }

}

function getUserId(req: any) : string
{
  return JSON.parse(req.cookies[COOKIE_NAME]).userId
}

const MAX_BULK_QUERY_BODY_LENGTH = 256;

const resolvers = {

  Query: {
    listUsers(_, __, context, ____)
    {
      if(isAuthorized(context.req))
        return [];

      return Array.from(userDataSource.data.values())
    },
    async login(parent, args, context, info)
    {
      if(args.password == undefined || args.name == undefined)
        return;
      let user = args.name.includes("@") ? userDataSource.getUserByEmail(args.name) :userDataSource.getUserByName(args.name)
      let pCompare = bcrypt.compare(args.password, user.hash)
      let valid = await pCompare;
      if(! valid)
        return {isErrored:true,errorMsg:"Invalid Login Credentials"};
      let token = tokenDataSource.GenerateUserAuth(user)
      context.res.setHeader('Set-Cookie',[serialize(COOKIE_NAME, JSON.stringify(token), {
        path: '/',
        httpOnly: true,
        sameSite: true,
        expires: new Date(token.Expire)
      })]);
      return {isErrored:false,token:token}
    },
    isLoggedIn(parent, args, context, info)
    {
      if(isAuthorized(context.req))
        return {isLoggedIn:true, userid:getUserId(context.req)};
      return {isLoggedIn:false};
    },
    getLatestPosts(parent, args, context, info)
    {
      if(args.max == 0)
      {
        return Array.from(postDataSource.data.values());
      }
      else
      {
        return Array.from(postDataSource.data.values()).sort((a,b) => {
          if(a.creationTime < b.creationTime)
            return -1;
          if(a.creationTime > b.creationTime)
            return 1;
          return 0;
        }).map(item => ({...item,body:item.body.length > MAX_BULK_QUERY_BODY_LENGTH ? item.body.substring(0,MAX_BULK_QUERY_BODY_LENGTH - 3) + "..." : item.body}));
      }
    },
    getPostsByUser(parent, args, context, info)
    {
      return postDataSource.getPostByUserId(args.userid).map(item => ({...item,body:item.body.length > MAX_BULK_QUERY_BODY_LENGTH ? item.body.substring(0,MAX_BULK_QUERY_BODY_LENGTH - 3) + "..." : item.body}));
    },
    getPostByTag(parent, args, context, info)
    {
      return postDataSource.getPostByTag(args.tag).map(item => ({...item,body:item.body.length > MAX_BULK_QUERY_BODY_LENGTH ? item.body.substring(0,MAX_BULK_QUERY_BODY_LENGTH - 3) + "..." : item.body}));
    },
    getPostByPostID(parent, args, context, info)
    {
      return postDataSource.getPostByPostID(args.postid);
    },

  },

  Mutation:{
    async registerUser (parent, args, context, info){

      if(args.email == undefined)
        return {isErrored:true, errorMsg:"Invalid email"};
      if(!args.email.includes("@"))
        return {isErrored:true, errorMsg:"Invlaid email"};
      if(userDataSource.getUserByEmail(args.email) != undefined)
        return {isErrored:true, errorMsg:"Email already registered"};
      if(args.password == undefined)
        return {isErrored:true, errorMsg:"Invalid password"};
      if(args.password.length < 8)
        return {isErrored:true, errorMsg:"Invalid password"};
      if(args.username == undefined)
        return {isErrored:true, errorMsg:"Invalid username"};
      if(args.username.length < 6)
        return {isErrored:true, errorMsg:"Invalid username"};
      if(userDataSource.getUserByName(args.username) != undefined)
        return {isErrored:true, errorMsg:"Username already registered"};

      let phash = bcrypt.hash(args.password, 10);
      let hash = await phash;
      let id = randomstring.generate(24);
      userDataSource.data.set(id,{id, username:args.username, email:args.email,hash:hash});
      fs.writeFileSync("Users.json", JSON.stringify(Array.from(userDataSource.data.values())));
      let token = tokenDataSource.GenerateUserAuth(userDataSource.getUserById(id));
      context.res.setHeader('Set-Cookie',[serialize("auth", JSON.stringify(token), {
        path: '/',
        httpOnly: true,
        sameSite: true,
        expires: new Date(token.Expire)
      }),
      serialize("auth-csrf", token.token, {
        path: '/',
        sameSite: true,
        expires: new Date(token.Expire)
      })
    ])
      return {isErrored:false,token:token};
    },
    logout(parent, args, context, info)
    {
      context.res.setHeader('Set-Cookie', serialize(COOKIE_NAME, "", {
        path: '/',
        httpOnly: true,
        sameSite: true
      }));
      return true;
    }
  },

  Post:{
    author:(post : Post, _, __) =>{
      return userDataSource.getUserById(post.authorID);
    }
  },

  User:{
    posts:(user: User, _, __) => postDataSource.getPostsByUser(user)
  }
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: (req) => {
    return req;
  }
});


const handler = apolloServer.createHandler({ path: "/api/graphql" });
export const config = {
  api: {
    bodyParser: false
  }
};
export default handler;
