import React from "react";
import { Link } from "react-router-dom";

const teamMembers = [
  {
    name: "Rohith Kumar",
    role: "MERN Stack Developer",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Sai Charan",
    role: "AI Engineer & Data Analyst",
    img: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    name: "Nayana",
    role: "HR Manager",
    img: "https://randomuser.me/api/portraits/women/55.jpg",
  },
  {
    name: "Rajeshwari",
    role: "Python Developer",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

const AboutPage = () => {
  return (
    <>

        {/* ================= HERO / COMPANY STORY ================= */}
        <section className="bg-gradient-to-r from-blue-50 to-white py-24 text-center">
          <div className="max-w-4xl mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              About <span className="text-blue-600">CivicFlow</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
              CivicFlow is a modern platform designed to streamline community maintenance. 
              Our mission is to empower residents and managers with an easy-to-use system for submitting, tracking, and resolving complaints efficiently.
            </p>
          </div>
        </section>

        {/* ================= OUR VISION / MISSION ================= */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Our Vision</h2>
              <p className="mt-4 text-gray-600">
                To create empowered communities where every maintenance request is handled transparently and efficiently, improving resident satisfaction.
              </p>

              <h2 className="mt-8 text-3xl font-bold text-gray-800">Our Mission</h2>
              <p className="mt-4 text-gray-600">
                Deliver a smart platform that connects residents with professionals, provides real-time updates, and ensures timely resolution of issues.
              </p>
            </div>

            <img
              src="https://images.unsplash.com/photo-1581091215366-8d9e8b3f43d2?crop=entropy&cs=tinysrgb&fit=max&w=600&h=400"
              alt="Team working"
              className="rounded-xl shadow-lg object-cover w-full"
            />
          </div>
        </section>

        {/* ================= PRODUCT FLOW ================= */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-800">How Our Product Works</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              CivicFlow simplifies community maintenance in three easy steps:
            </p>

            <div className="mt-12 grid md:grid-cols-3 gap-10 text-left">
              <div className="bg-blue-50 p-8 rounded-xl shadow-md hover:shadow-xl transition">
                <h3 className="text-xl font-semibold text-blue-600">1. Register</h3>
                <p className="mt-2 text-gray-600">
                  Residents or managers create an account and join their community.
                </p>
              </div>
              <div className="bg-green-50 p-8 rounded-xl shadow-md hover:shadow-xl transition">
                <h3 className="text-xl font-semibold text-green-600">2. Submit Requests</h3>
                <p className="mt-2 text-gray-600">
                  Raise complaints for electricity, plumbing, carpentry, or other services in just a few clicks.
                </p>
              </div>
              <div className="bg-yellow-50 p-8 rounded-xl shadow-md hover:shadow-xl transition">
                <h3 className="text-xl font-semibold text-yellow-600">3. Track & Resolve</h3>
                <p className="mt-2 text-gray-600">
                  Monitor the progress of your request in real-time until resolution.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= WHY CHOOSE US ================= */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-800">Why Choose CivicFlow?</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              We prioritize transparency, accountability, and speed. Our platform reduces miscommunication, ensures timely responses, and makes community maintenance effortless.
            </p>
          </div>

          <div className="mt-12 max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
            {[
              { title: "Transparency", desc: "Track every complaint with clear updates." },
              { title: "Efficiency", desc: "Quickly assign and resolve issues." },
              { title: "Satisfaction", desc: "Improve resident happiness and trust." },
            ].map((item, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
                <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
                <p className="mt-2 text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= TEAM ================= */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-800">Meet Our Team</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              The brilliant minds behind CivicFlow, driving innovation and excellence.
            </p>

            <div className="mt-12 grid sm:grid-cols-2 md:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-32 h-32 mx-auto rounded-full object-cover"
                  />
                  <h3 className="mt-4 font-semibold text-lg">{member.name}</h3>
                  <p className="mt-1 text-gray-500 text-sm">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="py-20 bg-blue-600 text-white text-center">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold">Join CivicFlow Today</h2>
            <p className="mt-4 text-blue-100">
              Sign up now and experience seamless community maintenance like never before.
            </p>
            <Link
              to="/register"
              className="mt-8 inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Get Started
            </Link>
          </div>
        </section>
      
    </>
  );
};

export default AboutPage;