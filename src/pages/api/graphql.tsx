import { graphql, buildSchema } from "graphql";
import { ApolloServer, gql,} from "apollo-server-micro";
const { DataSource } = require('apollo-datasource');
import {User} from '../../component/User'
const bcrypt = require("bcrypt")
var randomstring = require("randomstring");
const fs = require('fs');









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

type UserAuthToken
{
  token: String!,
  Expire: String!,
}

type Query {
  listUsers: [User!]
  login(name: String, password: String) : UserAuthToken
}

type Mutation{
  registerUser(username: String, email: String, password: String) : User
}
`;

let rawdata = fs.readFileSync('Users.json');
let userDataSource = new UserDataSource(JSON.parse(rawdata));

const resolvers = {

  Query: {
    listUsers(parent, args, context, info)
    {
      console.log(userDataSource);
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
        return;
      return {token:randomstring.generate(24),Expire:new Date().getTime() + 1000 * 60 * 60 * 24 * 30};
    }

  },

  Mutation:{
    async registerUser (parent, args, context, info){

      if(args.email == undefined || !args.email.includes("@"))
        return;
      if(args.password == undefined || args.password.length < 8)
        return;
      if(args.username == undefined || args.username.length < 6 || userDataSource.getUserByName(args.username) != undefined)
        return;

      let phash = bcrypt.hash(args.password, 10);
      let hash = await phash;
      let id = randomstring.generate(24);
      console.log(id);
      userDataSource.data.set(id,{id, username:args.username, email:args.email,hash:hash});
      fs.writeFileSync("Users.json", JSON.stringify(Array.from(userDataSource.data.values())));
      console.log(userDataSource);
      return userDataSource.getUserById(id);
    }
  }
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {
    return {};
  }
});


const handler = apolloServer.createHandler({ path: "/api/graphql" });
export const config = {
  api: {
    bodyParser: false
  }
};
export default handler;