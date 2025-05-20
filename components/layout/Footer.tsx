import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#070D1F] text-white py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1 lg:col-span-1">
            <h3 className="text-xl font-bold mb-4">Innovation Lab</h3>
            <p className="text-sm text-gray-300 mb-4">
              Empowering the Next Generation of Innovators through technology, research, and entrepreneurship at Itahari International College.
            </p>

          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-sm text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/events" className="text-sm text-gray-300 hover:text-white transition-colors">Events</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-300 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Events</h3>
            <ul className="space-y-2">
              <li><Link href="/events/iic-quest-3.0" className="text-sm text-gray-300 hover:text-white transition-colors">IIC Quest 3.0</Link></li>
              <li><Link href="/events/iic-quest-3.0#job-fair-details" className="text-sm text-gray-300 hover:text-white transition-colors">Job Fair</Link></li>
              <li><Link href="/events/iic-quest-3.0#project-exhibition-details" className="text-sm text-gray-300 hover:text-white transition-colors">Project Exhibition</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic">
              <p className="text-sm text-gray-300 mb-2">Itahari International College</p>
              <p className="text-sm text-gray-300 mb-2">Sundar Haraicha, Morang</p>
              <p className="text-sm text-gray-300 mb-2">Email: <a href="mailto:innovation.lab@iic.edu.np" className="hover:text-white transition-colors">innovation.lab@iic.edu.np</a></p>
              <p className="text-sm text-gray-300 mb-2">Phone: <a href="tel:+9779802776830" className="hover:text-white transition-colors">+977-9801597005</a></p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Innovation Lab at Itahari International College. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
