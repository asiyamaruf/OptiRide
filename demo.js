const express = require("express");
const {graphqlHTTP} = require("express-graphql");
const {buildschema} =require("graphql");
const app = express();
const schema = buildSchema( `
    type Product{
    id :ID!
    name:String!
    priceLFloat!
    }
    type Query {
    products:[Product]!
    }
`);
Let products = [
{id:"1",name:"Laptop",price:49999},
{id:"2",name:"Keyboard",price:1500},
];
const root = {
    products
}