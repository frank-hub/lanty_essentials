import React from "react";
import Layout from "./Layout";

const RefundPolicy = () => {
  return (
    <Layout>
      <section className="relative py-24 bg-[#98a69e]">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Refund Policy
          </h1>

          <p className="text-white text-lg">
            Customer satisfaction matters to us.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 space-y-10">

          <div>
            <h2 className="text-2xl font-bold mb-4">
              Eligibility for Refunds
            </h2>

            <ul className="space-y-3 text-gray-700">
              <li>• Wrong product received</li>
              <li>• Product arrived damaged</li>
              <li>• Order not delivered</li>
              <li>• Item significantly different from order</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">
              Non-Refundable Items
            </h2>

            <ul className="space-y-3 text-gray-700">
              <li>• Opened or used hygiene products</li>
              <li>• Change of mind after purchase</li>
              <li>• Misused products</li>
              <li>• Incorrect orders placed by customers</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">
              Refund Request Timeline
            </h2>

            <p className="text-gray-700 leading-8">
              Refund-related issues should be reported within 48 hours of receiving the order.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">
              Refund Process
            </h2>

            <p className="text-gray-700 leading-8">
              Approved refunds may be processed through the original payment method or an agreed alternative method.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">
              Refund Approval
            </h2>

            <p className="text-gray-700 leading-8">
              Lanty reserves the right to inspect refund claims before approval. Additional photos or supporting information may be requested.
            </p>
          </div>

        </div>
      </section>
    </Layout>
  );
};

export default RefundPolicy;
