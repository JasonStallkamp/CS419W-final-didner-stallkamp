/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core'
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';
import ApolloClient, { DocumentNode, gql } from 'apollo-boost';
import Navbar from '../../component/Navbar'

interface RegisterState
{
    email: string;
    emailInvalid: boolean;
    emailInvalidString: string;

    username: string;
    usernameInvalid: boolean;
    usernameInvalidSting: string;

    confirm: string;
    confirmInvalid: boolean;
    confirmInvalidString: string;

    password: string;
    passwordInvalid: boolean;
    passwordInvalidString: string;

    hasQueryElement: boolean;
    queryElement?: (query: DocumentNode, variables: any) => void;
}


interface QueryHandlerProps
{
    createQueryHandler: (handler: (query: DocumentNode, variables:any) => void) => void;
}

export default class Register extends React.Component<{},RegisterState>{

    constructor(props: {})
    {
        super(props);
        this.state =
        {
            email:"",
            username:"",
            confirm:"",
            password:"",
            confirmInvalid:false,
            emailInvalid:false,
            passwordInvalid:false,
            usernameInvalid:false,
            confirmInvalidString: "",
            emailInvalidString: "",
            passwordInvalidString: "",
            usernameInvalidSting: "",
            hasQueryElement:false,
        };
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

    validateData() : boolean
    {
        let valid = true;
        let errorStrings: any = {
            confirmInvalid:false,
            emailInvalid:false,
            passwordInvalid:false,
            usernameInvalid:false,
        };

        if(!this.state.email.includes("@"))
        {
            valid = false;
            errorStrings.emailInvalid = true;
            errorStrings.emailInvalidString = "Email is not valid"
        }

        if(this.state.username.length < 6)
        {
            valid = false;
            errorStrings.usernameInvalid = true;
            errorStrings.usernameInvalidSting = "Username is too short"
        }

        if(this.state.username.includes("@"))
        {
            valid = false;
            errorStrings.usernameInvalid = true;
            errorStrings.usernameInvalidSting = "Username cannot contain a @"
        }

        if(this.state.password.length < 8)
        {
            valid = false;
            errorStrings.passwordInvalid = true;
            errorStrings.passwordInvalidString = "password is too short"
        }

        if(this.state.password !== this.state.confirm)
        {
            valid = false;
            errorStrings.confirmInvalid = true;
            errorStrings.confirmInvalidString = "Passwords do not match"
        }

        this.setState((oldState =>{
            console.log(errorStrings);
            return {...oldState, ...errorStrings};
        }));
        return valid;
    }

    onSubmit()
    {
        const GET_USER_DATA = {query:`
        mutation registerUser
        {
          registerUser(username:"` + this.state.username + `",email:"`+ this.state.email +`",password:"`+
          this.state.password + `")
          {
            username,
            email,
            id
          }
        }
        `};

        fetch('/api/graphql',{
            method:"POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(GET_USER_DATA),

        })  .then(res => res.json())
        .then(res => console.log(res.data));
        console.log(this.validateData())
        console.log(this.state);
    }

    CreateOnChange(property: string) : (event: React.ChangeEvent<HTMLInputElement>) => any
    {
        return ((event : React.ChangeEvent<HTMLInputElement>) => this.onChangeText(property,event.target.value)).bind(this)
    }

    render()
    {
        let inputBlock = css({display:"block"});
        let labelStyle = css({margin:"20px 0px 0px 0px"});

        let errorLabelStype = css({margin:"3px 0px 0px 0px", color:"#FF0000"})
        let hidden = css({display:"none"});

        let invalidInputBlock = css({backgroundColor:"#FFCCCC"});

        return (<div>
            <Navbar/>
            <div css={this.state.emailInvalid ? [inputBlock, invalidInputBlock]: inputBlock}>
                <h1 css={labelStyle}>Email</h1>
                <h4 css={this.state.emailInvalid ?  [errorLabelStype] : [errorLabelStype, hidden]}>{this.state.emailInvalidString}</h4>
                <input onChange={this.CreateOnChange("email")} value={this.state.email} type="email" ></input>
            </div>
            <div css={this.state.usernameInvalid ? [inputBlock, invalidInputBlock]: inputBlock}>
                <h1 css={labelStyle}>Username</h1>
                <h4 css={this.state.usernameInvalid ?  [errorLabelStype] : [errorLabelStype, hidden]}>{this.state.usernameInvalidSting}</h4>
                <input onChange={this.CreateOnChange("username")} value={this.state.username}></input>
            </div>
            <div css={this.state.passwordInvalid ? [inputBlock, invalidInputBlock]: inputBlock}>
                <h1 css={labelStyle}>Password</h1>
                <h4 css={this.state.passwordInvalid ?  [errorLabelStype] : [errorLabelStype, hidden]}>{this.state.passwordInvalidString}</h4>
                <input onChange={this.CreateOnChange("password")} value={this.state.password} type="password"></input>
            </div>
            <div css={this.state.confirmInvalid ? [inputBlock, invalidInputBlock]: inputBlock}>
                <h1 css={labelStyle}>Confirm Password</h1>
                <h4 css={this.state.confirmInvalid ?  [errorLabelStype] : [errorLabelStype, hidden]}>{this.state.confirmInvalidString}</h4>
                <input onChange={this.CreateOnChange("confirm")} value={this.state.confirm} type="password"></input>
            </div>
            <button onClick={this.onSubmit.bind(this)}>Register</button>
            <Link href="/user/login">Already a User? Login</Link>
        </div>);
    }
}
