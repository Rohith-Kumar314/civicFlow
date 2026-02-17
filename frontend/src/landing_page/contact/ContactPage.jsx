import React from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

const faqs = [
  {
    question: "How quickly will you respond?",
    answer:
      "We aim to respond to all inquiries within 24–48 hours during business days.",
  },
  {
    question: "Where is your support office located?",
    answer:
      "Our support hub is centrally located — you can click the map to explore University of Hyderabad near Gachibowli, Telangana.",
  },
  {
    question: "Can I request new features?",
    answer:
      "Absolutely! Use the contact form to suggest features — we’re always listening to our users.",
  },
];

const ContactPage = () => {
  return (
    <main className="pt-24">

      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-r from-blue-50 to-white py-24 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Get in <span className="text-blue-600">Touch</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            We'd love to hear from you! Whether you have questions, feedback, or need support, our team at CivicFlow is here to help.
          </p>
        </div>
      </section>

      {/* ================= CONTACT INFO + FORM ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">Contact Information</h2>
            <p className="text-gray-600">Reach us using any method below and we'll get back to you soon.</p>

            <div className="space-y-4 text-gray-700">
              <div className="flex items-center gap-4">
                <FaEnvelope className="text-blue-600 text-xl" />
                <span>support@civicflow.com</span>
              </div>
              <div className="flex items-center gap-4">
                <FaPhone className="text-blue-600 text-xl" />
                <span>+91 1234 567 890</span>
              </div>
              <div className="flex items-center gap-4">
                <FaMapMarkerAlt className="text-blue-600 text-xl" />
                <span>Prof. C.R. Rao Road, Gachibowli, Hyderabad, Telangana, India</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a href="#" className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                <FaFacebookF />
              </a>
              <a href="#" className="p-3 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition">
                <FaTwitter />
              </a>
              <a href="#" className="p-3 bg-blue-800 text-white rounded-full hover:bg-blue-900 transition">
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 p-10 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Name</label>
                <input type="text" placeholder="Your Name" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                <input type="email" placeholder="Your Email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Subject</label>
                <input type="text" placeholder="Subject" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Message</label>
                <textarea rows="5" placeholder="Your Message" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ================= MAP SECTION ================= */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Location</h2>
          <p className="text-gray-600 mb-12">Click and drag the map to explore our region near University of Hyderabad.</p>
          <div className="w-full h-96 rounded-xl overflow-hidden shadow-lg">
            {/* Google embed for University of Hyderabad */}
            <iframe
              title="University of Hyderabad Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60454.987111709494!2d78.32785!3d17.453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93f27a497031%3A0xb353c2e6f7cef0f5!2sUniversity%20of%20Hyderabad!5e0!3m2!1sen!2sin!4v1700000000000"
              width="100%"
              height="100%"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      {/* ================= FAQ / TESTIMONIALS ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800">Frequently Asked Questions</h2>
          <p className="mt-4 text-gray-600">Here are some common questions we get asked.</p>
          <div className="mt-10 space-y-6 text-left">
            {faqs.map((item, index) => (
              <div key={index}>
                <h3 className="font-semibold text-lg text-blue-600">{item.question}</h3>
                <p className="mt-2 text-gray-700">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
};

export default ContactPage;
