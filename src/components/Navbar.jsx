import React from 'react'
//Using NavBar as a Component
const Navbar = () => {
  return (
    <nav className='flex justify-between bg-teal-800 text-white py-2'>
        <div className="logo">
            <span className="font-bold text-xl mx-8">TaskMate</span>
        </div>
    </nav>
  )
}

export default Navbar
