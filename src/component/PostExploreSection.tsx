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
    tags: [string],
    prompt: string,
    body: string
}

function PostDisplay({toDisplay}: {toDisplay:PostDisplayProp})
{
    const divCss = css({
        display:"block",
        backgroundColor:"lightgray"
    })

    const titleCSS = css({
        margin:"0px 0px 0px 0px",
        display:"inline-block"

    });

    const userCSS = css({
        margin:"0px 0px 0px 10px",
        display:"inline-block",
        color:"#333333",
    })

    const userTextCSS = css({
        textDecoration:"None",
        ":hover":{
            color:"blue",
            textDecoration:"underline"
        }
    })
    const tagBlockCSS = css(
        {
            display:"inline-block",
            backgroundColor:"white",
            margin:"5px 0px 0px 10px",
            borderRadius:"2px"
        })
    const tagTextCSS = css({
        margin:"0px 0px 0px 0px"
    });

    const tagMap = toDisplay.tags.map(item =>{
        return (
            <Link href="/tag/[tag]" as={"/tag/" + item} key={item}>
                <div css={tagBlockCSS} >
                    <h4 css={tagTextCSS}>{item}</h4>
                </div>
            </Link>);
    });

    return(<div css={divCss}>
            <Link href="/share/[storyid]" as={"/share/" + toDisplay.id}>
                <div>
                    <h1 css={titleCSS}>{toDisplay.title}</h1>
                    <h4 css={userCSS}> • Posted by:<Link  href="/user/[userid]" as={"/user/" + toDisplay.author.id}><a css={userTextCSS}>{toDisplay.author.username}</a></Link></h4>
                    <div>
                        {tagMap}
                    </div>
                    <p><strong>Prompt:</strong>{toDisplay.prompt}</p>
                    <p><strong>Body:</strong>{toDisplay.body}</p>
                </div>
            </Link>
            
            
        </div>);
}


function PostExploreSection(props : {query: String}) {
    let [stories, setStories] = useState<PostDisplayProp[]>([]);
    let [areStoriesSet, setAreStoriesSet] = useState<string>("");
    const router = useRouter();
    if(areStoriesSet !== router.asPath)
    {
        
        let varQuery = props.query.replace("$values",`
        id,
        title,
        author{
          username,
          id
        },
        tags,
        prompt,
        body
        `)
        setAreStoriesSet(router.asPath);
        const GraphQLQuerry = {query:varQuery};
        let apiPromis = fetch('/api/graphql',{
            method:"POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(GraphQLQuerry)})
        
        
        apiPromis.catch((reason) => {
            console.log(reason);
        })
        apiPromis.then(res => res.json()).then(res =>{
            setStories(res.data[Object.getOwnPropertyNames(res.data)[0]]);
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

  export default PostExploreSection