import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { FaWater, FaHammer, FaBroom, FaTree, FaShieldAlt, FaWifi, FaTrash } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";

const HomePage = () => {
  const services = [
    { icon: <HiOutlineLightningBolt className="text-5xl text-yellow-500 mx-auto" />, title: "Electricity", desc: "Report electrical issues and track resolution in real-time." },
    { icon: <FaWater className="text-5xl text-blue-500 mx-auto" />, title: "Plumbing", desc: "Manage leakages, pipe damage, and water supply complaints." },
    { icon: <FaHammer className="text-5xl text-orange-600 mx-auto" />, title: "Carpentry", desc: "Submit maintenance requests for doors, furniture, and repairs." },
    { icon: <FaBroom className="text-5xl text-green-500 mx-auto" />, title: "Cleaning", desc: "Schedule janitorial or cleaning services for community areas." },
    { icon: <FaTree className="text-5xl text-green-700 mx-auto" />, title: "Gardening", desc: "Request landscaping or gardening maintenance." },
    { icon: <FaShieldAlt className="text-5xl text-gray-700 mx-auto" />, title: "Security", desc: "Report gate issues or security concerns." },
    { icon: <FaWifi className="text-5xl text-purple-500 mx-auto" />, title: "IT & Wi-Fi", desc: "Submit complaints for network or tech issues." },
    { icon: <FaTrash className="text-5xl text-red-500 mx-auto" />, title: "Waste Management", desc: "Manage garbage collection or disposal requests." },
  ];

  return (
    <>

      

        {/* ================= HERO SECTION ================= */}
        <section className="bg-gradient-to-br from-blue-50 to-white py-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight">
              Smart Community
              <span className="text-blue-600"> Complaint Management</span>
            </h1>

            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
              CivicFlow helps communities manage maintenance issues efficiently across multiple services.
            </p>

            <div className="mt-8 flex justify-center gap-4 flex-wrap">
              <Link
                to="/register"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
              >
                Get Started
              </Link>

              <Link
                to="/product"
                className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition"
              >
                Explore Product
              </Link>
            </div>
          </div>
        </section>

        {/* ================= SERVICES SECTION ================= */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-800">
              Services We Cover
            </h2>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-12">
              {services.map((service, index) => (
                <div key={index} className="p-8 rounded-xl shadow-md hover:shadow-xl transition">
                  {service.icon}
                  <h3 className="mt-6 text-xl font-semibold">{service.title}</h3>
                  <p className="mt-3 text-gray-600">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-800">
              How CivicFlow Works
            </h2>

            <div className="grid md:grid-cols-3 gap-10 mt-12">

              <div>
                <FiCheckCircle className="text-4xl text-blue-600 mx-auto" />
                <h3 className="mt-4 font-semibold text-lg">Register</h3>
                <p className="mt-2 text-gray-600">
                  Create an account for your community or apartment.
                </p>
              </div>

              <div>
                <FiCheckCircle className="text-4xl text-blue-600 mx-auto" />
                <h3 className="mt-4 font-semibold text-lg">Raise Complaint</h3>
                <p className="mt-2 text-gray-600">
                  Submit detailed maintenance requests instantly.
                </p>
              </div>

              <div>
                <FiCheckCircle className="text-4xl text-blue-600 mx-auto" />
                <h3 className="mt-4 font-semibold text-lg">Track Progress</h3>
                <p className="mt-2 text-gray-600">
                  Monitor status updates until issue resolution.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ================= CTA SECTION ================= */}
        <section className="py-20 bg-blue-600 text-white text-center">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Simplify Community Maintenance?
            </h2>

            <p className="mt-4 text-blue-100">
              Join CivicFlow today and transform how your community handles complaints.
            </p>

            <Link
              to="/register"
              className="mt-8 inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Create Free Account
            </Link>
          </div>
        </section>

      
    </>
  );
};

export default HomePage;