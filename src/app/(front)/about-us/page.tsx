// File: pages/about.js

import { Metadata } from "next";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { IoIosInformation } from "react-icons/io";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about our company",
  openGraph: {
    title: "About Us",
    description: "Learn more about our company",
    type: "website",
  },
};

export default function About() {
  return (
    <div className="min-h-screen ">
      {/* Breadcrumb Navigation */}
      <div className="text-sm breadcrumbs border-b border-gray-300 dark:border-gray-700">
        <ul className="container mx-auto px-4 flex space-x-2">
          <li>
            <Link href="/" className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="w-4 h-4 mr-1"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
              Home
            </Link>
          </li>
          <li className="flex items-center">
            <IoIosInformation className="w-4 h-4 mr-1" />
            About Us
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-10 px-4">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome to Agu Brothers</h1>
          <p className="text-lg">
            Your One-Stop Destination for Quality Electronics
          </p>
        </div>

        {/* Sections */}
        {sections.map(({ title, content }, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-3xl font-semibold mb-2">{title}</h2>
            <p className="leading-relaxed">{content}</p>
          </div>
        ))}

        {/* Product Range */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold mb-2">Our Product Range</h2>
          <ul className="list-disc list-inside leading-relaxed">
            {products.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Contact Information */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold mb-2">Contact Information</h2>
          <p>
            Agu Brothers Electronics <br />
            33 Ogui Road <br />
            Enugu State, Nigeria <br />
            Phone: 09099234242 <br />
            Email: agubiggest@gmail.com
          </p>
        </div>

        {/* Social Media Links */}
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
          <div className="flex justify-center gap-6">
            {socialLinks.map(({ href, icon, label }, index) => (
              <Link
                key={index}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition duration-300"
                aria-label={label}
              >
                {icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const sections = [
  {
    title: 'Who We Are',
    content: `At Agu Brothers, we are dedicated to bringing the best in home electronics and appliances 
    to our valued customers. From high-definition televisions to energy-efficient refrigerators, 
    and from versatile gas cookers to powerful freezers, our mission is simple: to provide reliable, 
    innovative, and affordable products that enhance your everyday life.`,
  },
  {
    title: 'Our Story',
    content: `Agu Brothers started with a vision to bridge the gap between technology and comfort. 
    Founded in 1979, we began with a small range of electronic products, and over time, we've expanded 
    to cater to diverse customer needs. Today, we are proud to be a leading supplier of quality electronics, 
    helping homes and businesses upgrade and improve their lifestyle.`,
  },
  {
    title: 'Why Choose Us?',
    content: `We believe in giving our customers the best value for their money. Our key strengths include:
    Quality Assurance, Affordable Prices, Expert Support, and Customer Satisfaction. We partner with leading 
    brands to bring you products that are built to last and ensure all our products go through rigorous quality checks.`,
  },
  {
    title: 'Our Mission and Vision',
    content: `Our mission is to provide a seamless shopping experience for every customer, backed by superior products 
    and unmatched service. We aim to be a trusted name in the electronics retail industry, known for our commitment to 
    quality, affordability, and reliability. Our vision is to become a household name synonymous with excellence and convenience.`,
  },
  {
    title: 'Visit Us Today',
    content: `We invite you to visit our store or explore our online shop to discover the perfect products for your home. 
    At Agu Brothers, we’re more than just a shop – we’re a partner in making your home life easier, more comfortable, and more enjoyable.`,
  },
];

const products = [
  "Televisions: From smart TVs to LED and UHD options with crystal-clear visuals and exceptional sound quality.",
  "Gas Cookers: Our collection combines safety, durability, and efficiency.",
  "Refrigerators & Freezers: Choose from compact models to larger units ideal for family homes or commercial use.",
  "Home Appliances: Including microwaves, air conditioners, washing machines, and more.",
];

const socialLinks = [
  {
    href: 'https://facebook.com/yourprofile',
    icon: <FaFacebookF size={30} />,
    label: 'Facebook',
  },
  {
    href: 'https://instagram.com/yourprofile',
    icon: <FaInstagram size={30} />,
    label: 'Instagram',
  },
  {
    href: 'https://twitter.com/yourprofile',
    icon: <FaTwitter size={30} />,
    label: 'Twitter',
  },
];
