import React from "react";
import Layout from "./Layout";

const ShippingPolicy = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 bg-[#98a69e]">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Shipping Policy
          </h1>
          <p className="text-white text-lg">
            Safe and reliable delivery across Kenya.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 space-y-10">

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Order Processing
            </h2>

            <ul className="space-y-3 text-gray-700">
              <li>• Orders are processed within the same day after payment confirmation.</li>
              <li>• Orders placed on weekends or public holidays may be processed on the next business day.</li>
              <li>• Customers receive shipping updates once orders are dispatched.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Delivery Areas
            </h2>

            <p className="text-gray-700 leading-8">
              Lanty currently delivers across Kenya. Delivery timelines may vary depending on your location.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Estimated Delivery Times
            </h2>

            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-3">
                <strong>Nairobi:</strong> Same day delivery
              </p>

              <p className="text-gray-700">
                <strong>Outside Nairobi:</strong> Next day delivery
              </p>
            </div>

            <p className="text-gray-600 mt-4">
              Delivery timelines are estimates and may occasionally be affected by weather, courier delays, holidays, or unforeseen circumstances.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Shipping Fees
            </h2>

            <p className="text-gray-700 leading-8">
              Shipping fees are calculated based on delivery location and order size. Charges are communicated during checkout or before order confirmation.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Incorrect Shipping Information
            </h2>

            <p className="text-gray-700 leading-8">
              Customers are responsible for providing accurate delivery information. Lanty is not responsible for delays or failed deliveries caused by incorrect addresses or phone numbers.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Delayed or Lost Orders
            </h2>

            <p className="text-gray-700 leading-8">
              If your order is significantly delayed or not received within the estimated timeframe, please contact our support team for assistance.
            </p>
          </div>

        </div>
      </section>
    </Layout>
  );
};

export default ShippingPolicy;
