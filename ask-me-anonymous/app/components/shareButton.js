import React, { useState } from 'react'

export default function ShareButton(props) {

  const [status, setStatus] = useState('');
  const link=props.link;
    const copyLink = () => {
        navigator.clipboard.writeText(link)
          .then(() => {
            setStatus('Link copied to clipboard!');
            setTimeout(() => setStatus(''), 2000); // Clear the status after 2 seconds
          })
          .catch(err => {
            console.error('Failed to copy: ', err);
            setStatus('Failed to copy link.');
          });
      };
    return (
        <button
            onClick={copyLink}
            style={{
                padding: '10px 20px',
                fontSize: '16px',
                cursor: 'pointer',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
            }}
        >
            Copy Link
        </button>
    )
}
