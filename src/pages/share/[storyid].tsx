/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React,{useState, useEffect} from 'react';
import Link from 'next/link';
import Navbar from '../../component/Navbar';
import fetch from 'isomorphic-unfetch';
import { useRouter } from 'next/router';



export default function ShareStoryId(){

  const container = css`
    padding: 15px;
    border: black;
  `;

  const textarea = css`
    height: 60%;
    width: 90%;
  `;

  const spacer = css`

    padding: 10px 10px 10px 10px;
    background-color: lightgray;
    border-top: 1px solid #CCCCCC;
    border-right: 1px solid #333333;
    border-bottom: 1px solid #333333;
    border-left: 1px solid #CCCCCC;
    margin: 10px 10px 10px 10px;
  `;

  const [promptResponse, setPromptResponse] = useState("");
  const [textArea, setTextArea] = useState("");
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [newpost, setNewpost] = useState(false);

  let existingPost = false;

  const router = useRouter();

  const postid = router.query.storyid;
  console.log(postid)

  const GraphQLQuerry = {
    query: `
          {
            getPostByPostID(postid:"`+postid+`")
            {
              title,
              author{
                username,
              },
              prompt,
              body
            }
          }
   `};






  useEffect(() => {

    let apiPromis = fetch('/api/graphql',{
        method:"POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(GraphQLQuerry)})

    apiPromis.catch((reason) => {
        console.log(reason);
    })
    apiPromis.then(res => res.json()).then(res =>{
        console.log(res);

        if(res.data != null && res.data.getPostByPostID != null){
          const localPrompt =  res.data.getPostByPostID.prompt;
          setPromptResponse(localPrompt);
          const localTextArea = res.data.getPostByPostID.body;
          setTextArea(localTextArea);
          const localTitle =  res.data.getPostByPostID.title;
          setTitle(localTitle);
          const localUsername = res.data.getPostByPostID.author.username;
          setName(localUsername);

        }
        else{
          const localPrompt =  localStorage.getItem("_prompt");
          setPromptResponse(localPrompt);
          const localTextArea = localStorage.getItem("_text");
          setTextArea(localTextArea);


        }
    })

  }, [promptResponse, textArea, name, title]);


  function sharePost(){
        console.log("in share posts")
        const share_post = {query:`
        mutation
        {
          addPost(
          postid:"`  + router.query.storyid +
          `",title:"`+title +
          `",prompt:"` +promptResponse+
          `",body:"`+textArea+
          `")
        }
        `};

        fetch('/api/graphql',{
            method:"POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(share_post),

        }). then(res=> res.json())
        .then(res=> {
          console.log(res)
        });

        router.push('/explore');

    }


  return(
    <div>
      <Navbar/>
      <form>
        <div style={{marginLeft: 13 , marginTop: 20, marginBottom: 10}}>
          <label>
            Title:
            <input type="text" name="title" value={title} onChange={e => setTitle(e.target.value)}/>
          </label>
        </div>

        <div css={container}>
          <text> Prompt:  </text>
          <text> {promptResponse} </text>
        </div>


        <div css={container}>
          <text> Text:  </text>
          <text> {textArea} </text>
        </div>

        <div style={{marginTop: 50}}>
          <text css={spacer} onClick={()=>{sharePost()}}> SHARE</text>
        </div>
      </form>
    </div>
  );
}
