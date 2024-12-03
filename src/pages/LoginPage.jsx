import React from 'react'

const LoginPage = () => {
  return (
    <>
        <div className="w-screen h-screen bg-[#FAF6E3] flex justify-center items-center">
          <div className="w-1/3 h-96 bg-[#D8DBBD] rounded-md">
          <form action="">
          <h1 className="font-semibold">Login Page</h1>
          <div className="flex flex-col">
            <label>Email</label>
            <input type="email" placeholder="example@example.com" />
            <label>Password</label>
            <input type="password" placeholder=".........." />

          </div>
          </form>
          
          </div>
        </div>
    </>
  )
}

export default LoginPage