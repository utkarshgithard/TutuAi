import React from 'react'

const Navbar = () => {
    return (
        <div>
            <nav class="bg-gray-900 text-white">
                <div class="container mx-auto px-4 py-4 flex justify-between items-center">
                    <a href="#" class="text-xl font-bold">Welcome To Nebula</a>
                    
                    <ul class=" flex  space-x-6">
                        <li><a href="#about" class="hover:text-gray-300">About</a></li>
                        <li><a href="#services" class="hover:text-gray-300">Services</a></li>
                        <li><a href="#contact" class="hover:text-gray-300">Contact</a></li>
                    </ul>
                </div>
            </nav>

        </div>
    )
}

export default Navbar
