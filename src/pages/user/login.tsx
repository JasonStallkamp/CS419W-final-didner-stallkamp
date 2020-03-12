/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core'
import Link from 'next/link'
import Navbar from '../../component/Navbar'

interface LoginState
{
    name: string;
    password: string;
    errored: boolean;
}

export default class Login extends React.Component<{},LoginState>
{
    constructor(props: {})
    {
        super(props);
        this.state = {name:"",password:"",errored:false}
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
        console.log(this.state);
    }

    render()
    {
        let inputBlock = css({display:"block"});
        let labelStyle = css({margin:"20px 0px 0px 0px"});

        let errorLabelStype = css({margin:"3px 0px 0px 0px", color:"#FF0000"})

        return (<div>
            <Navbar/>
            <div css={inputBlock}>
                <h1 css={labelStyle}>Email or Username</h1>
                <input onChange={this.CreateOnChange("email")} value={this.state.name} type="email" ></input>
            </div>
            <div css={inputBlock}>
                <h1 css={labelStyle}>Password</h1>
                <input onChange={this.CreateOnChange("password")} value={this.state.password} type="password"></input>
            </div>
            <button onClick={this.onSubmit.bind(this)}>Login</button>
            <Link href="/user/register">Not a user? Register</Link>
        </div>);
    }
};
