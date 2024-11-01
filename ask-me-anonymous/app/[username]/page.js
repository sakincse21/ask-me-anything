import React, { Suspense } from 'react';
import Loading from './loading';
import SendMessageForm from '@/app/components/sendmessagesform';
import { redirect } from 'next/navigation';
import Homeredirectbtn from '@/app/components/homeredirectbtn';

export default async function SendMessageUsername({ params }) {
    const { username } = await (params);
    console.log(username);


    const checkUser = await fetch(`http://localhost:3001/user/${username}`, {
        next: {
            revalidate: 10
        }
    });

    const checked = await checkUser.json();


    if (!checked) {
        redirect('/');
    }

    return (
        <>
            <Suspense fallback={<Loading />}>
                <SendMessageForm username={username}></SendMessageForm>
            </Suspense>
        </>
    );
}