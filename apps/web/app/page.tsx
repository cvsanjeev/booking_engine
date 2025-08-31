import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BookingSearch } from '@/components/booking/search-form';
import { PropertySelector } from '@/components/booking/property-selector';
import { FeaturedProperty } from '@/components/booking/featured-property';
import { PropertyCard } from '@/components/booking/property-card';
import { getProperties } from '@/lib/api/properties';

export default async function Home() {
  const properties = await getProperties();
  
  return (
    <main>
      {/* Hero Section with Search */}
      <section className="relative bg-gradient-to-b from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/hero-bg.jpg"
            alt="Luxury apartment interior"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your Home Away From Home
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              Premium service apartments in India's top cities with all the comforts of home and the luxury of a hotel.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-xl p-4 md:p-6">
              <Suspense fallback={<div className="h-14 animate-pulse bg-gray-200 rounded"></div>}>
                <BookingSearch properties={properties} />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Properties</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Apartments?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Feels Like Home</h3>
              <p className="text-gray-600">Spacious apartments with fully equipped kitchens, living areas, and all the comforts of home.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Stays</h3>
              <p className="text-gray-600">Stay for a night, a week, or months. Our flexible booking options adapt to your schedule.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Service</h3>
              <p className="text-gray-600">24/7 support, regular cleaning, and dedicated staff to ensure a comfortable stay.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Guests Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center">
                  <span className="font-medium text-blue-800">AR</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Amit R.</h4>
                  <div className="flex text-yellow-400">
                    <span>★★★★★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">"Perfect for my business trip. The location was convenient and having a separate workspace made it easy to work remotely."</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center">
                  <span className="font-medium text-blue-800">SP</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Sunita P.</h4>
                  <div className="flex text-yellow-400">
                    <span>★★★★★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">"We stayed as a family of four and loved having the extra space compared to a hotel. The kitchen was fully stocked and we felt right at home."</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center">
                  <span className="font-medium text-blue-800">RK</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Rahul K.</h4>
                  <div className="flex text-yellow-400">
                    <span>★★★★★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">"Very clean and modern apartments with excellent service. The staff was always responsive and helped with all our requests."</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}