"use client"
import React, { useState, use } from 'react';

export default function SendMessageForm(props) {
    const { username } = props;
    console.log(username);
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const messagesending = await fetch(`http://localhost:3001/push/${username.replace("@", "%40")}`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message }) // body data type must match "Content-Type" header
        });
        const ifSent = await messagesending.json();
        if (ifSent) {
            // setMessage('');
            setSent(true);
        } else {
            alert('errorrrr');
        }
        // Here you would typically send the message to a server
        // console.log('Message sent:', message);
        // alert('Message sent successfully!');
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
                <div>
                    <h4 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Send Anonymous Message to {username}</h4>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-md -space-y-px">
                        <div>
                            <label htmlFor="message" className="sr-only">Your Message</label>
                            <textarea
                                id="message"
                                name="message"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Your anonymous message"
                                rows="5"
                                value={message}
                                onChange={(e) => {
                                    e.preventDefault();
                                    setSent(false);
                                    setMessage(e.target.value)
                                }}
                            ></textarea>
                        </div>
                    </div>

                    <div>
                        {
                            !sent?
                            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Send Message</button>
                            :
                            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Message Sent</button>

                        }
                    </div>
                </form>
            </div>
        </div>
    );
}