"use client"
import React from 'react';

const BiodataProfile = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen print:p-0 print:m-0">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Bio Data</h1>
        <button 
          onClick={() => window.print()} 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors print:hidden"
        >
          Download PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 print:gap-4">
        {/* Images Section */}
        <div className="space-y-4 print:space-y-2 print:flex print:gap-4">
  <div className="aspect-square relative flex-1">
    <img 
      src="/image_1.jpg" 
      alt="Profile" 
      className="rounded-lg shadow-md object-cover w-full h-full print:w-auto print:h-auto print:shadow-none"
    />
  </div>
  <div className="aspect-square relative flex-1">
    <img 
      src="/image_2.jpg" 
      alt="Full body" 
      className="rounded-lg shadow-md object-cover w-full h-full print:w-auto print:h-auto print:shadow-none"
    />
  </div>
</div>


        {/* Details Section */}
        <div className="md:col-span-2 space-y-6 print:space-y-4">
          {/* Personal Information */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm print:shadow-none print:p-4 print:bg-white print:border">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Name</p>
                <p className="font-semibold">Jayaram D</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Date of Birth</p>
                <p className="font-semibold">March 6, 1997</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Birth Time</p>
                <p className="font-semibold">12:20 PM</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Height</p>
                <p className="font-semibold">5'10" (178 cm)</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Religion & Caste</p>
                <p className="font-semibold">Hindu, Ezhuva</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Birth Star</p>
                <p className="font-semibold">Thiruvonam</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Rashi</p>
                <p className="font-semibold">Magaram</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Dhosam</p>
                <p className="font-semibold">Suthajadhagam</p>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm print:shadow-none print:p-4 print:bg-white print:border">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Professional Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Qualification</p>
                <p className="font-semibold">B.E. Mechanical</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Occupation</p>
                <p className="font-semibold">Design Engineer</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Company</p>
                <p className="font-semibold">Roots Multiclean Ltd</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Annual Salary</p>
                <p className="font-semibold">₹7 Lakhs</p>
              </div>
            </div>
          </div>

          {/* Family Information */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm print:shadow-none print:p-4 print:bg-white print:border">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Family Information</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Father</p>
                <p className="font-semibold">Dharmaraj (Retired)</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Mother</p>
                <p className="font-semibold">Chandrakumari (Late)</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Sibling</p>
                <p className="font-semibold">Ajay (Younger Brother, Full Stack Developer)</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm print:shadow-none print:p-4 print:bg-white print:border">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Contact Information</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Address</p>
                <p className="font-semibold">
                  No-25, 2nd East Street, Sakthi Nagar Ext.,
                  Neelikonampalayam, Coimbatore - 641033
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Phone Numbers</p>
                <p className="font-semibold">+91 93451 42430, +91 79046 43481</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiodataProfile;