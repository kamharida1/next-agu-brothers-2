// File: pages/about.js

import { Metadata } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa'
import { IoIosInformation } from 'react-icons/io'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about our company',
  openGraph: {
    title: 'About Us',
    description: 'Learn more about our company',
    type: 'website',
  }
}

export default function About() {
  return (
    <div>
      <div className="text-sm breadcrumbs  border-b-2 border-b-orange-600">
        <ul className="dark:text-black">
          <li>
            <Link href={'/'}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="w-4 h-4 mr-2 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                ></path>
              </svg>
              Home
            </Link>
          </li>
          <li>
            <IoIosInformation className="w-4 h-4 mr-2 stroke-current" />
            About Us
          </li>
        </ul>
      </div>
      <div className="container mx-auto py-10 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
          <p className="text-lg text-gray-600">
            Welcome to our company! We are committed to providing you with the
            best products and services. Our team works hard to ensure your
            satisfaction and deliver an exceptional experience.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8">
          <div className="flex flex-col items-center">
            {/* <img
              src="/images/our_team.jpg" // Replace with your actual team image path
              alt="Our Team"
              className="rounded-lg shadow-lg w-80 h-80 object-cover mb-4"
            /> */}
            <Image
              src="/images/our_team.jpg"
              alt="Our Team"
              width={320}
              height={320}
            />
            <h2 className="text-2xl font-semibold mb-2">Our Team</h2>
            <p className="text-gray-600 text-center">
              Meet our dedicated team of professionals who strive to bring you
              the best experience.
            </p>
          </div>

          <div className="flex flex-col items-center">
            {/* <img
              src="/images/our_mission.jpg" // Replace with your actual mission image path
              alt="Our Mission"
              className="rounded-lg shadow-lg w-80 h-80 object-cover mb-4"
            /> */}
            <Image
              src="/images/our_mission.jpg"
              alt="Our Mission"
              width={320}
              height={320}
            />
            <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
            <p className="text-gray-600 text-center">
              Our mission is to innovate and lead in our industry while
              maintaining integrity and providing outstanding customer service.
            </p>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
          <div className="flex justify-center gap-6">
            {/* Facebook */}
            <a
              href="https://facebook.com/yourprofile" // Replace with your actual Facebook profile link
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition duration-300"
            >
              <FaFacebookF size={30} />
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/yourprofile" // Replace with your actual Instagram profile link
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-800 transition duration-300"
            >
              <FaInstagram size={30} />
            </a>

            {/* Twitter */}
            <a
              href="https://twitter.com/yourprofile" // Replace with your actual Twitter profile link
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-600 transition duration-300"
            >
              <FaTwitter size={30} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
