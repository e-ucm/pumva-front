import React from 'react'

export default function Login() {
  return (
    <div>
        <div>Login</div>
        <iframe id="sso_connect" className="content_filled" src="/api/ssoconnect"></iframe>
    </div>
  )
}