/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React,{useState} from 'react';
import Link from 'next/link';

export default function ShareStoryId(){

  const container = css`
    padding: 15px;
    border: black;
  `;

  const textarea = css`
    height: 60%;
    width: 90%;
  `;

  const [promptResponse, setPromptResponse] = useState<string>("DEFAULT SOMETHING SOEMTHING");
  const [textArea, setTextArea] = useState<string>("");


  return(
    <form>
      <label>
        Title:
        <input type="text" name="title" />
      </label>

      <label>
        Name:
        <input type="text" name="name" />
      </label>

      <div css={container}>
        <text> {promptResponse} </text>
      </div>

      <textarea rows={20} value={textArea} onChange={e => setTextArea(e.target.value)} css={textarea}> </textarea>

      <input type="submit" value="Submit" />
    </form>

  );
}
