import { graphql, buildSchema } from "graphql";

const schema = buildSchema(`
  type Query {
    hello: String!
  }
`);

const respovers = { 
  hello: (parent, args, context, info) => "Hello world! 3" 
};

export default async (req, res) => {
  const query = req.body.query;
  const response = await graphql(schema, query, respovers);

  return res.end(JSON.stringify(response));
};