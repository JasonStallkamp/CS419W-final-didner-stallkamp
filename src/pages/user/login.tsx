/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core'
import Link from 'next/link'
import Navbar from '../../component/Navbar'
import {withRouter, NextRouter } from 'next/router'
import { WithRouterProps } from 'next/dist/client/with-router';
import { runInThisContext } from 'vm';

import nextCookie from 'next-cookies'


interface LoginState
{
    name: string;
    password: string;
    errored: boolean;
    router: NextRouter;
    invalidSubmit: boolean;
}

class Login extends React.Component<WithRouterProps,LoginState>
{
    constructor(props: WithRouterProps)
    {
        super(props);
        this.state = {name:"",password:"",errored:false, router:props.router, invalidSubmit:false}
    }
    onChangeText(property: string, value : string)
    {
        this.setState((oldState) =>
        {
            var newState = {...oldState};
            if(this.state.hasOwnProperty(property))
            {
                newState[property] = value;
            }
            return newState;
        })
    }
    CreateOnChange(property: string) : (event: React.ChangeEvent<HTMLInputElement>) => any
    {
        return ((event : React.ChangeEvent<HTMLInputElement>) => this.onChangeText(property,event.target.value)).bind(this)
    }



    onSubmit()
    {
        this.setState(old => ({...old, invalidSubmit:false}))
        const GraphQLQuerry = {query:`
        {
            login(password:"`+this.state.password +`",name:"`+this.state.name + `")
            {
              isErrored,
              errorMsg,
              token{
                token,
                Expire
              }
            }
          }
        `}

          fetch('/api/graphql',{
            method:"POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(GraphQLQuerry),

        })  .then(res => res.json())
        .then(res => {
            if(res.data.login != null && res.data.login.isErrored == false)
            {
                this.state.router.replace('/');
            }
            else
            {
                this.setState(old => ({...old, invalidSubmit:true}))
            }
        });
    }

    render()
    {
        let inputBlock = css({display:"block"});
        let labelStyle = css({margin:"20px 0px 0px 0px"});
        let invalidInputBlock = css({backgroundColor:"#FFCCCC"});

        return (<div>
            <Navbar/>
            <div css={this.state.invalidSubmit ? [inputBlock, invalidInputBlock]: inputBlock}>
                <h1 css={labelStyle}>Email or Username</h1>
                <input onChange={this.CreateOnChange("name")} value={this.state.name} type="email" ></input>
            </div>
            <div css={this.state.invalidSubmit ? [inputBlock, invalidInputBlock]: inputBlock}>
                <h1 css={labelStyle}>Password</h1>
                <input onChange={this.CreateOnChange("password")} value={this.state.password} type="password"></input>
            </div>
            <button onClick={this.onSubmit.bind(this)}>Login</button>
        </div>);
    }
};


export default withRouter(Login);