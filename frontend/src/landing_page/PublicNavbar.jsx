import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineSync } from "react-icons/ai";
import { FaTools } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
const PublicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  // Determine dashboard path based on role
  const getDashboardPath = () => {
    if (!user) return "/";

    switch (user.role) {
      case "admin":
        return "/admin";
      case "resident":
        return "/resident";
      case "worker":
        return "/worker";
      default:
        return "/";
    }
  };

  return (
    <header className="w-full bg-white shadow-md border-b border-gray-200 fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <AiOutlineSync className="text-4xl text-blue-600" />
            <FaTools className="absolute text-white text-sm" />
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-xl font-bold text-gray-800">
              Civic<span className="text-blue-600">Flow</span>
            </span>
            <span className="text-xs text-gray-500 hidden sm:block">
              Smart Community Maintenance
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          <Link to="/about" className="hover:text-blue-600 transition">About</Link>
          <Link to="/product" className="hover:text-blue-600 transition">Product</Link>
          <Link to="/pricing" className="hover:text-blue-600 transition">Pricing</Link>
          <Link to="/contact" className="hover:text-blue-600 transition">Contact</Link>
        </nav>

        {/* Desktop Auth / Dashboard */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className="text-blue-600 font-medium hover:text-blue-700 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
              >
                Register
              </Link>
            </>
          ) : (
            <Link
              to={getDashboardPath()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <FiX className="text-2xl text-gray-800" />
            ) : (
              <FiMenu className="text-2xl text-gray-800" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="flex flex-col px-6 py-4 gap-4 text-gray-700 font-medium">
            <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
            <Link to="/product" onClick={() => setIsOpen(false)}>Product</Link>
            <Link to="/pricing" onClick={() => setIsOpen(false)}>Pricing</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>

            <hr />

            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-blue-600"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </>
            ) : (
              <Link
                to={getDashboardPath()}
                onClick={() => setIsOpen(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-700 transition"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;



// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { AiOutlineSync } from "react-icons/ai";
// import { FaTools } from "react-icons/fa";
// import { FiMenu, FiX } from "react-icons/fi";

// const PublicNavbar = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <header className="w-full bg-white shadow-md border-b border-gray-200 fixed top-0 left-0 z-50">
//       <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

//         {/* Logo */}
//         <Link to="/" className="flex items-center gap-3">
//           <div className="relative flex items-center justify-center">
//             <AiOutlineSync className="text-4xl text-blue-600" />
//             <FaTools className="absolute text-white text-sm" />
//           </div>

//           <div className="flex flex-col leading-tight">
//             <span className="text-xl font-bold text-gray-800">
//               Civic<span className="text-blue-600">Flow</span>
//             </span>
//             <span className="text-xs text-gray-500 hidden sm:block">
//               Smart Community Maintenance
//             </span>
//           </div>
//         </Link>

//         {/* Desktop Navigation */}
//         <nav className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
//           <Link to="/" className="hover:text-blue-600 transition">Home</Link>
//           <Link to="/about" className="hover:text-blue-600 transition">About</Link>
//           <Link to="/product" className="hover:text-blue-600 transition">Product</Link>
//           <Link to="/pricing" className="hover:text-blue-600 transition">Pricing</Link>
//           <Link to="/contact" className="hover:text-blue-600 transition">Contact</Link>
//         </nav>

//         {/* Desktop Auth Buttons */}
//         <div className="hidden md:flex items-center gap-4">
//           <Link
//             to="/login"
//             className="text-blue-600 font-medium hover:text-blue-700 transition"
//           >
//             Login
//           </Link>

//           <Link
//             to="/register"
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
//           >
//             Register
//           </Link>
//         </div>

//         {/* Mobile Menu Toggle */}
//         <div className="md:hidden">
//           <button onClick={() => setIsOpen(!isOpen)}>
//             {isOpen ? (
//               <FiX className="text-2xl text-gray-800" />
//             ) : (
//               <FiMenu className="text-2xl text-gray-800" />
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isOpen && (
//         <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
//           <div className="flex flex-col px-6 py-4 gap-4 text-gray-700 font-medium">
//             <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
//             <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
//             <Link to="/product" onClick={() => setIsOpen(false)}>Product</Link>
//             <Link to="/pricing" onClick={() => setIsOpen(false)}>Pricing</Link>
//             <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>

//             <hr />

//             <Link
//               to="/login"
//               onClick={() => setIsOpen(false)}
//               className="text-blue-600"
//             >
//               Login
//             </Link>

//             <Link
//               to="/register"
//               onClick={() => setIsOpen(false)}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-700 transition"
//             >
//               Register
//             </Link>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default PublicNavbar;
