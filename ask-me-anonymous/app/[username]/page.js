import React, { Suspense } from 'react';
import Loading from './loading';
import SendMessageForm from '@/app/components/sendmessagesform';
import { redirect } from 'next/navigation';
import Homeredirectbtn from '@/app/components/homeredirectbtn';

export default async function SendMessageUsername({ params }) {
    const { username } = await (params);
    console.log(username);


    const checkUser = await fetch(`https://ask-me-anonymous-server.onrender.com/user/${username}`, {
        next: {
            revalidate: 10
        }
    });

    const checked = await checkUser.json();
    const updatedUsername=username.replace("%40", "@");

    if (!checked) {
        redirect('/');
    }

    return (
        <>
            <Suspense fallback={<Loading />}>
                <SendMessageForm username={updatedUsername}></SendMessageForm>
            </Suspense>
        </>
    );
}