"use client"
import React, { useContext } from 'react';

// Import initializeApp from "firebase/app" and other authentication functions from "firebase/auth"
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { LoginContext } from '../profile/page';
import { redirect } from 'next/navigation';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_apiKey, // Use NEXT_PUBLIC_ prefix for Next.js environment variables
    authDomain: process.env.NEXT_PUBLIC_authDomain,
    projectId: process.env.NEXT_PUBLIC_projectId,
    storageBucket: process.env.NEXT_PUBLIC_storageBucket,
    messagingSenderId: process.env.NEXT_PUBLIC_messagingSenderId,
    appId: process.env.NEXT_PUBLIC_appId
};

export default function Login() {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    const [isLoggedIn, setIsLoggedIn, displayName, setDisplayName] = useContext(LoginContext);

    if (isLoggedIn) {
        redirect('/profile');
    }

    const signIn = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
                localStorage.setItem('token', user.accessToken);
                setDisplayName(user.displayName);
                setIsLoggedIn(true);

                fetch('http://localhost:3001/login', {
                    method: "POST",
                    headers: {
                        "name": `${user.displayName}`,
                        "authorization": `${user.accessToken}`
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log(data); // Assuming `isAuthenticated` is a boolean from the server
                        // redirect('/profile');
                    })
                    .catch(error => {
                        console.error("Error during login check:", error);
                    });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
                console.error("Error during sign-in:", errorMessage);
            });
    }
    return (
        <div className=' min-h-screen  flex flex-col justify-center items-center'>
            <button onClick={signIn} className=' border-transparent border p-4 rounded bg-blue-700 text-nowrap text-xl'>Sign in with Google</button>
        </div>
    );
}
