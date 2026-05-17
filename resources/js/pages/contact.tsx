import React from "react";
import Layout from "./Layout";

const Contact: React.FC = () => {
    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h1>
                <p className="text-gray-600 mb-4">
                    We’d love to hear from you! Whether you have questions about our products, need assistance with an order, or just want to say hello, our team is here to help.
                </p>
                <p className="text-gray-600 mb-4">
                    You can reach us through the following channels:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-4">
                    <li>Email: support@lantyessentials.co.ke</li>
                    <li>Phone: +254 10 668 7003</li>
                    <li>Address: Nairobi, Kenya</li>
                </ul>
            </div>
        </Layout>
    );
};

export default Contact;
