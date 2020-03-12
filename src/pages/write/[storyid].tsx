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
    width: 60%;
  `;


  const spacer = css`
    padding: 10;
  `;

  const [adj1, setAdj1] = useState(false)
  const [adj2, setAdj2] = useState(false)
  const [noun1, setNoun1] = useState(false)
  const [adverb, setAdverb] = useState(false)
  const [verb, setVerb] = useState(false)
  const [adj3, setAdj3] = useState(false)
  const [adj4, setAdj4] = useState(false)
  const [noun2, setNoun2] = useState(false)
  const [location,setLocation] = useState(false)


  return (
    <div>
      <Navbar/>
      <h1>Writing Page</h1>

      <div>
        <ul css={ul}>
          <li css={outerstyle}><text style={{padding: 10, fontSize: 25, backgroundColor: 'lightblue'}}>Prompt</text></li>
          <li css={outerstyle}><text style={{padding: 10, fontSize: 25, backgroundColor: 'lightgreen'}}>↻</text></li>
        </ul>
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
        <text> RESPONSE FROM PROMPT SITE WOULD GO HERE </text>
      </div>

      <div>
        <ul css={ul}>
          <li css={outerstyle}><div ><text css={spacer}>TEXT</text></div></li>
          <li css={outerstyle}><div ><text css={spacer}>Save</text></div></li>
          <li css={outerstyle}><div ><text css={spacer}>Share</text></div></li>
          <li css={outerstyle}><div ><text css={spacer}>Download</text></div></li>
        </ul>
      </div>


      <textarea css={textarea}> </textarea>

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
    background-color: ${props.selected ? "lightblue" : "gainsboro"};
  `;

  return (
    <li css={outerstyle}>
      <div css={style}>
        <text onClick={() => props.setter(prev => !prev)}>{props.children}</text>
      </div>
    </li>
  );
}
