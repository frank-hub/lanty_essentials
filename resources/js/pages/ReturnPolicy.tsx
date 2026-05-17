import React from "react";
import Layout from "./Layout";

const ReturnPolicy = () => {
  return (
    <Layout>
      <section className="relative py-24 bg-[#98a69e]">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Return Policy
          </h1>

          <p className="text-white text-lg">
            Shop with confidence at Lanty.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 space-y-10">

          <div>
            <h2 className="text-2xl font-bold mb-4">
              Return Eligibility
            </h2>

            <ul className="space-y-3 text-gray-700">
              <li>• Incorrect product received</li>
              <li>• Damaged item upon delivery</li>
              <li>• Product unused and in original packaging</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">
              Return Request Period
            </h2>

            <p className="text-gray-700 leading-8">
              Return requests must be made within 48 hours of receiving your order.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">
              Condition of Returned Items
            </h2>

            <ul className="space-y-3 text-gray-700">
              <li>• Must be unused</li>
              <li>• Must remain in original packaging</li>
              <li>• Must include original components where applicable</li>
            </ul>

            <p className="text-gray-600 mt-4">
              Lanty reserves the right to reject returns that do not meet these conditions.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">
              Non-Returnable Items
            </h2>

            <p className="text-gray-700 leading-8">
              Opened or used laundry products may not qualify for returns unless the item is defective.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">
              Return Shipping
            </h2>

            <p className="text-gray-700 leading-8">
              If the return is due to a damaged product or an error by Lanty, return shipping costs may be covered.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">
              Inspection & Approval
            </h2>

            <p className="text-gray-700 leading-8">
              All returned products are inspected before replacements or refunds are approved.
            </p>
          </div>

        </div>
      </section>
    </Layout>
  );
};

export default ReturnPolicy;
