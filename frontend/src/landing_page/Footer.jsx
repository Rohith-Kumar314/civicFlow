import React from "react";
import { FaFacebook, FaSquareInstagram, FaXTwitter } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 pt-16 pb-6 border-t">

      <div className="max-w-7xl mx-auto px-6">

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Company Info */}
          <div className="space-y-4">
            <h2 className="text-gray-900 text-lg font-semibold">
              My Company
            </h2>

            <address className="not-italic text-sm leading-6">
              123 Main Street <br />
              New York, NY 10001 <br />
              <a href="tel:+1234567890" className="hover:text-blue-600 transition">
                +1 234 567 890
              </a>
              <br />
              <a
                href="mailto:info@company.com"
                className="hover:text-blue-600 transition"
              >
                info@company.com
              </a>
            </address>

            {/* Social Icons */}
            <div className="flex space-x-3 pt-2">
              <a
                href="#"
                className="p-2 bg-white border rounded-full shadow-sm hover:bg-red-100 transition"
              >
                <MdEmail size={18} className="text-red-500" />
              </a>

              <a
                href="#"
                className="p-2 bg-white border rounded-full shadow-sm hover:bg-blue-100 transition"
              >
                <FaFacebook size={18} className="text-blue-600" />
              </a>

              <a
                href="#"
                className="p-2 bg-white border rounded-full shadow-sm hover:bg-pink-100 transition"
              >
                <FaSquareInstagram size={18} className="text-pink-500" />
              </a>

              <a
                href="#"
                className="p-2 bg-white border rounded-full shadow-sm hover:bg-gray-200 transition"
              >
                <FaXTwitter size={18} className="text-black" />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h2 className="text-gray-900 text-lg font-semibold mb-4">
              Company
            </h2>
            <ul className="space-y-2 text-sm">
              {["About Us", "Careers", "Contact Us", "Why CMS", "Data Privacy"].map(
                (item, index) => (
                  <li key={index}>
                    <a href="#" className="hover:text-blue-600 transition">
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h2 className="text-gray-900 text-lg font-semibold mb-4">
              Products
            </h2>
            <ul className="space-y-2 text-sm">
              {[
                "Community App",
                "Locks",
                "Resident App",
                "Gate Module",
                "ERP Module",
              ].map((item, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-blue-600 transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h2 className="text-gray-900 text-lg font-semibold mb-4">
              Resources
            </h2>
            <ul className="space-y-2 text-sm">
              {["Blog", "Help Center", "All Features", "Privacy Policy"].map(
                (item, index) => (
                  <li key={index}>
                    <a href="#" className="hover:text-blue-600 transition">
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-12 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} All Rights Reserved by{" "}
          <span className="text-gray-900 font-medium">
            Rohith Kumar
          </span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
