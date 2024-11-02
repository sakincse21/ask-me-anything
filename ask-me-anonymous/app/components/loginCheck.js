// 'use client';

// import React, { useState } from 'react'

// const doLogin = async (token) => {
//     const response = await axios.get(`https://ask-me-anonymous-server.onrender.com/logincheck`, {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     });
//     return response.json();
// }

// const [isLoggedIn, setIsLoggedIn] = useState(false);

// const savedToken = localStorage.getItem('token');

// if (savedToken && !isLoggedIn) {
//     setIsLoggedIn(doLogin);
// }else{
//     setIsLoggedIn(false);
// }

// export default isLoggedIn;
