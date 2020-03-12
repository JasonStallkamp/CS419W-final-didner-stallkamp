import React from 'react';
import Link from 'next/link';
import Navbar from '../component/Navbar'

export default function Custom403() {
  return (
    <div>
      <Navbar/>
      <h1>403 - You are Forbidden, try logging in or registering</h1>
      <ul>
        <li>
          <Link href="/">
            <a>Home</a>
          </Link>
        </li>
        <li>
          <Link href="/user/login">
            <a>Login</a>
          </Link>
        </li>
        <li>
          <Link href="/user/register">
            <a>Register</a>
          </Link>
        </li>
      </ul>
    </div>


  );
}
