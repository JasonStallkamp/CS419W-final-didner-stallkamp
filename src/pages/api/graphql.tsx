import { ApolloServer, gql,} from "apollo-server-micro";
const { DataSource } = require('apollo-datasource');
import {User, UserAuthToken} from '../../component/User'
const bcrypt = require("bcrypt")
var randomstring = require("randomstring");
const fs = require('fs');

import nextCookie from 'next-cookies'
import { serialize } from 'cookie';

const COOKIE_NAME= "Auth";





class UserDataSource extends DataSource<object>{
  data: Map<String,User>
  constructor(data : User[])
  {
      super();
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




const typeDefs = gql`
type User{
  id: String!,
  username: String!,
  email: String!
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

type Query {
  listUsers: [User!]
  login(name: String, password: String) : ErrorableOrUserAuthToken
  isLoggedIn: Boolean!
}

type Mutation{
  registerUser(username: String, email: String, password: String) : ErrorableOrUserAuthToken!
  logout: Boolean!
}
`;

let rawdata = fs.readFileSync('Users.json');
let userDataSource = new UserDataSource(JSON.parse(rawdata));
let UserTokens = new Map<string,UserAuthToken>();


function GenerateUserAuth(user: User) : UserAuthToken
{
  let newToken = {userId:user.id,token:randomstring.generate(24), Expire: "" + new Date().getTime() + 1000 * 60 * 60 * 24 * 30};
  UserTokens.set(newToken.token,newToken);
  return newToken
}

function isAuthTokenValid(token: UserAuthToken) : boolean
{
  let compare = UserTokens.get(token.token);
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
      let token = GenerateUserAuth(user)
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
      return isAuthorized(context.req);
    }

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
      let token = GenerateUserAuth(userDataSource.getUserById(id));
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