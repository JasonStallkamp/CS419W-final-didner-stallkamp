import { useEffect } from "react";
import {useRouter} from 'next/router'
import fetch from 'isomorphic-unfetch';
import React from 'react';

export default function()
{
    let router = useRouter();
    useEffect(() =>{
    const GraphQLQuerry = {query:`
    mutation
    {
        logout
    }
      `};

      fetch('/api/graphql',{
        method:"POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(GraphQLQuerry)})
        .then(res => res.json())
        .then(res =>{
            router.replace("/");
        })
    });
    return (<h1></h1>);
}