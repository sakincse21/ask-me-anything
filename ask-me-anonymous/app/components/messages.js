import React from 'react'

export default function ShowMessages(props) {
    const message=props.message;
    return (
        <div className=" bg-slate-600 border rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            <p className=" text-white text-lg">{message}</p>
        </div>
    )
}
