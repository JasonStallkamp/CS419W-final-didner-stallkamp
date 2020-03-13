/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import Navbar from '../component/Navbar'
import React,{useState, useEffect} from 'react';
import fetch from 'isomorphic-unfetch';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface PostDisplayProp
{
    id: string;
    title: string;
    author:{id:string, username:string};
    tags: [string]
}

function PostDisplay({toDisplay}: {toDisplay:PostDisplayProp})
{
    const divCss = css({
        display:"block",
        backgroundColor:"red"
    })

    return(<div css={divCss}>
            <h1>{toDisplay.title}</h1>
            <Link href="/user/[userid]" as={"/user/" + toDisplay.author.id}><a>{toDisplay.author.username}</a></Link>
        </div>);
}


export default function PostExploreSection(props : {query: String}) {
    let [stories, setStories] = useState<PostDisplayProp[]>([]);
    let [areStoriesSet, setAreStoriesSet] = useState<boolean>(false);
    if(!areStoriesSet)
    {
        console.log(props.query);
        setAreStoriesSet(true);
        const GraphQLQuerry = {query:props.query};
      fetch('/api/graphql',{
        method:"POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(GraphQLQuerry)}).then(res => res.json()).then(res =>{
            setStories(res.data[Object.getOwnPropertyNames(res.data)[0]]);
            console.log(res.data[Object.getOwnPropertyNames(res.data)[0]]);
        })
    }

    let storyElements = {};
    if(stories != undefined)
        storyElements = stories.map(item => <PostDisplay key={item.id} toDisplay={item}></PostDisplay>)
    return (
      <div>
        <Navbar/>
        {storyElements}
      </div>
    );
  }
  