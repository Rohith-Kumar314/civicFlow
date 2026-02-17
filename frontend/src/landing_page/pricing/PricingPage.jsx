import React from "react";
import { Link } from "react-router-dom";

const pricingPlans = [
  {
    title: "Basic",
    price: "Free",
    features: [
      "Submit up to 5 complaints per month",
      "Community-wide announcements",
      "Email support",
    ],
    cta: "Get Started",
    ctaLink: "/register",
    bgColor: "bg-white",
    textColor: "text-gray-800",
    borderColor: "border-gray-200",
  },
  {
    title: "Pro",
    price: "$19/mo",
    features: [
      "Unlimited complaints",
      "Real-time tracking dashboard",
      "Priority support",
      "Custom notifications",
    ],
    cta: "Upgrade Now",
    ctaLink: "/register",
    bgColor: "bg-blue-600",
    textColor: "text-white",
    borderColor: "border-blue-600",
  },
  {
    title: "Enterprise",
    price: "Contact Us",
    features: [
      "Dedicated account manager",
      "Advanced analytics",
      "Custom integrations",
      "24/7 support",
    ],
    cta: "Contact Sales",
    ctaLink: "/contact",
    bgColor: "bg-white",
    textColor: "text-gray-800",
    borderColor: "border-gray-200",
  },
];

const PricingPage = () => {
  return (
    <>
      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-r from-blue-50 to-white py-24 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Choose the <span className="text-blue-600">Right Plan</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
            CivicFlow provides flexible pricing options to meet the needs of any community, from small apartment complexes to large residential networks.
          </p>
        </div>
      </section>

      {/* ================= PRICING PLANS ================= */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800">Pricing Plans</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Select the plan that fits your community's needs.
          </p>

          <div className="mt-12 grid sm:grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`${plan.bgColor} ${plan.textColor} border ${plan.borderColor} rounded-xl shadow-md p-8 flex flex-col justify-between hover:shadow-xl transition`}
              >
                <div>
                  <h3 className="text-xl font-semibold">{plan.title}</h3>
                  <p className="mt-4 text-3xl font-bold">{plan.price}</p>

                  <ul className="mt-6 space-y-3 text-left">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="mr-2 text-green-500">&#10003;</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={plan.ctaLink}
                  className={`mt-8 inline-block w-full text-center py-3 rounded-lg font-semibold transition ${
                    plan.bgColor === "bg-blue-600"
                      ? "bg-white text-blue-600 hover:bg-gray-100"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-20 bg-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Simplify Community Maintenance?
          </h2>
          <p className="mt-4 text-blue-100">
            Join CivicFlow today and experience seamless complaint management.
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

export default PricingPage;
