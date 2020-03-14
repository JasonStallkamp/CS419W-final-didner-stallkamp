/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React,{useState} from 'react';
import Link from 'next/link';
import Navbar from '../../component/Navbar';


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

  const textarea = css`
    height: 60%;
    width: 90%;
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
    border: black;
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

  const [promptResponse, setPromptResponse] = useState<string>("RESPONSE FROM PROMPT SITE WOULD GO HERE, HIT THE REFRESH BUTTON FOR A PROMPT");
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


    // var data = new Blob([res], {type: 'text/csv'});
    // var csvURL = window.URL.createObjectURL(data);
    // tempLink = document.createElement('a');
    // tempLink.href = csvURL;
    // tempLink.setAttribute('download', 'filename.csv');
    // tempLink.click();
  }


  return (
    <div>
      <Navbar/>
      <h1>Writing Page</h1>

      <div>
        <ul css={ul}>
          <li css={outerstyle}><text style={{padding: 10, fontSize: 25, backgroundColor: 'lightblue'}}>Prompt</text></li>
          <li css={outerstyle}><text onClick={() => fetchPrompt()} style={{padding: 10, fontSize: 25, backgroundColor: 'lightgreen'}}>↻</text></li>
        </ul>
      </div>

      <div css={container}>
        <text> {promptResponse} </text>
      </div>

      <div>
        <ul css={ul}>
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



      <div>
        <ul css={ul}>
          <li css={outerstyle}><div ><text>TEXT</text></div></li>
          <li css={outerstyle}><div ><text css={spacer}>Save</text></div></li>
          <li css={outerstyle}><div ><text css={spacer}>Share</text></div></li>
          <li css={outerstyle}><div onClick={() => downloadTxtFile()}><text css={spacer}>Download</text></div></li>
        </ul>
      </div>


      <textarea rows={20} value={textArea} onChange={e => setTextArea(e.target.value)} css={textarea}> </textarea>

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
    padding: 10px;
    margin: 10px;
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
