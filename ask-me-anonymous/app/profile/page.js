'use client'

import React, { createContext, Suspense, useEffect, useState } from 'react';
import Login from '../components/login';
import { redirect } from 'next/navigation';
import Loading from './loading';

import ShareButton from '../components/shareButton';
import ShowMessages from '../components/messages';

export const LoginContext = createContext();

export default function Profile() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [token, setToken] = useState('');
  const [messages, setMessages] = useState([]);
  const [link, setLink]=useState('http://ask-me-anonymous.vercel.app/');

  // First useEffect to retrieve the token from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, []);

  // Second useEffect to check login status only when the token is available
  useEffect(() => {
    if (token) {
      fetch(`https://ask-me-anonymous-server.onrender.com/login`, {
        method: "POST",
        headers: { authorization: `${token}` }
      })
        .then(res => res.json())
        .then(data => {
          // console.log(data);
          setDisplayName(data.name)
          setIsLoggedIn(data.ifuser);
          setMessages(data.messages);
          setEmail(data.username);
          setLink(`http://ask-me-anonymous.vercel.app/${data.username}`) // Assuming `isAuthenticated` is a boolean from the server
          // redirect('/profile');
        })
        .catch(error => {
          console.error("Error during login check:", error);
        });
    }

  }, [token]);


  return (
    <LoginContext.Provider value={[isLoggedIn, setIsLoggedIn, displayName, setDisplayName]}>

      <div className='min-h-screen '>
        {isLoggedIn ? (

          <Suspense fallback={<Loading />}>

            <div className="min-h-screen bg-transparent p-8">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-4xl font-bold text-slate-100 mb-8">Hello, {displayName}!</h2>
                <br />
                <hr />
                <h3 className="text-2xl font-bold text-slate-100 mb-4">Share link to get more messages...!</h3>
                <input
                  type="text"
                  value={link}
                  readOnly
                  // style={{ padding: '10px', width: '300px', textAlign: 'center', marginBottom: '10px' }}
                  className=' p-3 w-auto text-center mb-3 bg-slate-800 text-gray-100 rounded'
                />
                <ShareButton link={link}></ShareButton>
                <br />
                <hr />
                <h3 className="text-2xl font-bold text-slate-100 mb-4">Your latest messages...!</h3>

                {messages && <div className="space-y-4">
                  {messages.map((message, index) => (
                      <ShowMessages message={message} key={index}></ShowMessages>
                  ))}
                </div>}
              </div>
            </div>
          </Suspense>
        ) : (
          <Login />
        )}
      </div>

    </LoginContext.Provider >
  );
}
