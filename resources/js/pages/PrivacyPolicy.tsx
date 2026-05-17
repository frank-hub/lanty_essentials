import React from "react";
import Layout from "./Layout";

const PrivacyPolicy = () => {
  return (
    <Layout>
      <section className="relative py-24 bg-[#98a69e]">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Privacy Policy
          </h1>

          <p className="text-white text-lg">
            Your privacy and personal information matter to us.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 space-y-10">

          <div>
            <h2 className="text-2xl font-bold mb-4">
              Information We Collect
            </h2>

            <p className="text-gray-700 leading-8">
              We may collect your name, email address, phone number, shipping address, and payment information when you place an order.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">
              How We Use Your Information
            </h2>

            <ul className="space-y-3 text-gray-700">
              <li>• To process orders</li>
              <li>• To improve customer experience</li>
              <li>• To communicate updates and support</li>
              <li>• To improve our products and services</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">
              Data Protection
            </h2>

            <p className="text-gray-700 leading-8">
              We implement appropriate security measures to protect your personal information from unauthorized access or disclosure.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">
              Third-Party Services
            </h2>

            <p className="text-gray-700 leading-8">
              We may use trusted third-party services for payment processing and delivery services necessary to complete your order.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">
              Your Rights
            </h2>

            <p className="text-gray-700 leading-8">
              You may request access, correction, or deletion of your personal information by contacting our support team.
            </p>
          </div>

        </div>
      </section>
    </Layout>
  );
};

export default PrivacyPolicy;
