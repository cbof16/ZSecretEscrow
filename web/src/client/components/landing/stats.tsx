"use client"

export function Stats() {
  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Trusted by developers and freelancers worldwide
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Our platform ensures secure and private transactions for all parties
            </p>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col bg-white p-8">
              <dt className="text-sm font-semibold leading-6 text-gray-600">Transactions processed</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">$12M+</dd>
            </div>
            <div className="flex flex-col bg-white p-8">
              <dt className="text-sm font-semibold leading-6 text-gray-600">Active users</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">8,000+</dd>
            </div>
            <div className="flex flex-col bg-white p-8">
              <dt className="text-sm font-semibold leading-6 text-gray-600">Completed contracts</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">25,000+</dd>
            </div>
            <div className="flex flex-col bg-white p-8">
              <dt className="text-sm font-semibold leading-6 text-gray-600">Success rate</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">99.8%</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
} 