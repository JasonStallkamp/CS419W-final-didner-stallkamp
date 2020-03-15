/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React,{useState, useEffect} from 'react';
import Link from 'next/link';
import Navbar from '../../component/Navbar';


import {getPrompt, getText} from '../../redux/selectors';
import { useSelector } from 'react-redux';

export default function ShareStoryId(){

  const container = css`
    padding: 15px;
    border: black;
  `;

  const textarea = css`
    height: 60%;
    width: 90%;
  `;

  const [promptResponse, setPromptResponse] = useState("");
  const [textArea, setTextArea] = useState("");




  useEffect(() => {

    const localPrompt =  localStorage.getItem("_prompt");
    setPromptResponse(localPrompt);
    const localTextArea = localStorage.getItem("_text");
    setTextArea(localTextArea);

  }, [promptResponse, textArea]);



  return(
    <div>
      <Navbar/>
      <form>
        <div>
          <label>
            Title:
            <input type="text" name="title" />
          </label>
        </div>

        <div>
          <label>
            Name:
            <input type="text" name="name" />
          </label>
        </div>

        <div css={container}>
          <text> Prompt:  </text>
          <text> {promptResponse} </text>
        </div>

        <textarea rows={20} value={textArea}  css={textarea}> </textarea>

        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}
