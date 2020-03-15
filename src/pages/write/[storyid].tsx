/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React,{useState} from 'react';
import Link from 'next/link';
import Navbar from '../../component/Navbar';
import { useRouter } from "next/router";
import Router from 'next/router';



export default function WriteStoryId(){

  const ul = css`
    list-style-type: none;
    margin: 0;
    overflow: hidden;
    flex: 1;
    padding: 10px;
  `;

  const outerstyle = css`
    float: left;
    display: inline;
  `;

  const outerstyleright = css`
    float: right;
    display: inline;
  `;

  const textarea = css`
    height: 60%;
    width: 97%;
  `;




  const spacer = css`
    margin: 10px;
    padding: 10px;
    background-color: lightgray;
    border-top: 1px solid #CCCCCC;
    border-right: 1px solid #333333;
    border-bottom: 1px solid #333333;
    border-left: 1px solid #CCCCCC;
  `;

  const container = css`
    padding: 15px;
    margin: 10px;
    border-style: solid;

  `;

  const [adj1, setAdj1] = useState<boolean>(false);
  const [adj2, setAdj2] = useState<boolean>(false);
  const [noun1, setNoun1] = useState<boolean>(false);
  const [adverb, setAdverb] = useState<boolean>(false);
  const [verb, setVerb] = useState<boolean>(false);
  const [adj3, setAdj3] = useState<boolean>(false);
  const [adj4, setAdj4] = useState<boolean>(false);
  const [noun2, setNoun2] = useState<boolean>(false);
  const [location,setLocation] = useState<boolean>(false);

  const [promptResponse, setPromptResponse] = useState<string>("A snide truck driver and a smelly history professor.");
  const [textArea, setTextArea] = useState<string>("");


  async function fetchPrompt() {

    let query: string = "";


    adj1 ?  query = query.concat("adj") : null ;
    adj2  ? query = query.concat("+adj") : null ;
    noun1 ? query = query.concat("+noun") : null ;
    adverb ? query = query.concat("+adv") : null ;
    verb ? query = query.concat("+verb") : null ;
    adj3 ? query = query.concat("+adj") : null ;
    adj4 ? query = query.concat("+adj") : null ;
    noun2 ? query = query.concat("+noun") : null ;
    location ? query = query.concat("+location") : null ;

    console.log("query: " + query);

    const response = await fetch(
      `https://ineedaprompt.com/dictionary/default/prompt?q=${query}`
    );
    const responseData = await response.json();
    console.log(responseData)
    setPromptResponse(responseData.english);
  }

  function downloadTxtFile(){
    const element = document.createElement("a");
    const file = new Blob(["Prompt: \n" + promptResponse + "\n\n\n" + "Body: " + textArea], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "myStory.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  const router = useRouter();



  function moveToShare(){
    // dispatch(setPrompt(promptResponse));
    // dispatch(setText(textArea));
    localStorage.setItem("_prompt",promptResponse);
    localStorage.setItem("_text",textArea);

    router.push("/share/" + router.query.storyid);
  }




  return (
    <div>
      <Navbar/>
      <h1>Writing Page</h1>

      <div>
        <ul css={ul}>
          <li css={outerstyle}><text style={{padding: 10, fontSize: 25, backgroundColor: 'lightblue'}}>Prompt</text></li>
          <li css={outerstyle}><text onClick={() => fetchPrompt()} style={{padding: 10, fontSize: 25, backgroundColor: 'lightgreen'}}>↻</text></li>
          <ListSelector selected={adj1} setter={setAdj1}>adj</ListSelector>
          <ListSelector selected={adj2} setter={setAdj2}>adj</ListSelector>
          <ListSelector selected={noun1} setter={setNoun1}>noun</ListSelector>
          <ListSelector selected={adverb} setter={setAdverb}>adverb</ListSelector>
          <ListSelector selected={verb} setter={setVerb}>verb</ListSelector>
          <ListSelector selected={adj3} setter={setAdj3}>adj</ListSelector>
          <ListSelector selected={adj4} setter={setAdj4}>adj</ListSelector>
          <ListSelector selected={noun2} setter={setNoun2}>noun</ListSelector>
          <ListSelector selected={location} setter={setLocation}>location</ListSelector>
        </ul>
      </div>

      <div css={container}>
        <text style={{fontSize: 19}}> {promptResponse} </text>
      </div>

      <div style={{marginLeft: 10, paddingTop: 15}}>
        <text>TEXT</text>
      </div>

      <textarea style={{marginLeft: 10}} rows={20} value={textArea} onChange={e => setTextArea(e.target.value)} css={textarea}> </textarea>


      <div>
        <ul css={ul}>
          <li css={outerstyleright}><div onClick={() => moveToShare()}><text css={spacer}>Share</text></div></li>
          <li css={outerstyleright}><div onClick={() => downloadTxtFile()}><text css={spacer}>Download</text></div></li>
        </ul>
      </div>

    </div>
  );
}

function ListSelector(props){

  const outerstyle = css`
    float: left;
    display: inline;
    backgroundColor
  `;

  const style =css`
    padding: 8px;
    margin-Left: 17px;
    border-top: 1px solid #CCCCCC;
    border-right: 1px solid #333333;
    border-bottom: 1px solid #333333;
    border-left: 1px solid #CCCCCC;
    background-color: ${props.selected ? "lightblue" : "gainsboro"};
  `;

  return (
    <li css={outerstyle}>
      <div onClick={() => props.setter(prev => !prev)} css={style}>
        <text >{props.children}</text>
      </div>
    </li>
  );
}
