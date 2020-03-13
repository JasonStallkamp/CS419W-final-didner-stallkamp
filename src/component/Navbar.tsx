/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React,{useState, useEffect} from 'react';
import fetch from 'isomorphic-unfetch';
import Link from "next/link";
import { useRouter } from "next/router";



function Navbar(props) {
  const[isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const[CheckLogginState,setCheckLogginState] = useState<boolean>(false)
  const[userid, setUserId] = useState<string>("");
  useEffect(() =>{
    if(!CheckLogginState)
    {
      setCheckLogginState(true);
      const GraphQLQuerry = {query:`
      {
        isLoggedIn
        {
          isLoggedIn,
          userid
        }
      }
      `};
      fetch('/api/graphql',{
        method:"POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(GraphQLQuerry)}).then(res => res.json()).then(res =>{
          setIsLoggedIn(res.data.isLoggedIn.isLoggedIn);
          if(res.data.isLoggedIn.isLoggedIn)
          {
            setUserId(res.data.isLoggedIn.userid);
          }
        })
    }
  })


  const ul = css`
    list-style-type: none;
    margin: 0;
    overflow: hidden;
    background-color: black;
    flex: 1;
    padding: 10px;
  `;
  if(isLoggedIn)
  {
    return (
      <div>
      <ul css={ul}>
        <NavigationLink path="/" align="left">Home</NavigationLink>
        <NavigationLink path="/explore" align="left">Explore</NavigationLink>
        <NavigationLink path="/write/1" align="left">Write</NavigationLink>
        <NavigationLink path="/user/loggout" align="right">Loggout</NavigationLink>
        <NavigationLink path="/user/[userid]" as={"/user/" + userid} align="right">My Posts</NavigationLink>
      </ul>
      </div>
    );
  }
  else
  {
    return (
      <div>
      <ul css={ul}>
        <NavigationLink path="/" align="left">Home</NavigationLink>
        <NavigationLink path="/explore" align="left">Explore</NavigationLink>
        <NavigationLink path="/write/1" align="left">Write</NavigationLink>
        <NavigationLink path="/user/register" align="right">Register</NavigationLink>
        <NavigationLink path="/user/login" align="right">Login</NavigationLink>
      </ul>
      </div>
    );
  }
}


function NavigationLink(props){

  const router = useRouter();

  const style = css`
    color: white;
    flex: 1;
    padding: 10px;
    &:hover {
      background-color: gainsboro;
    }
    background-color: ${router.pathname == props.path ? "gainsboro" : "black"};
  `;

  const outerstyle = css`
    float: ${props.align=='right' ? 'right' : 'left'};
    display: inline;
  `;

  const activestyle = css`
    color: "gray";
    backgroundColor: "whitesmoke";
    padding: "10px";
  `;

  return (
    <li css={outerstyle}>
        <Link href={props.path} as={props.as === undefined ? props.path : props.as} >
          <div css={style}>
            {props.children}
          </div>
        </Link>
    </li>);
}


export default Navbar;
