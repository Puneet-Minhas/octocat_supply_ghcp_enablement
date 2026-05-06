import { useState } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { api } from '../../../api/config';
import { useTheme } from '../../../context/ThemeContext';

interface Supplier {
  supplierId: number;
  name: string;
  description: string;
  contactPerson: string;
  email: string;
  phone: string;
  active: boolean;
  verified: boolean;
}

type ActiveFilter = 'all' | 'active' | 'inactive';
type VerifiedFilter = 'all' | 'verified' | 'unverified';

const fetchSuppliers = async (): Promise<Supplier[]> => {
  const { data } = await axios.get(`${api.baseURL}${api.endpoints.suppliers}`);
  return data;
};

export default function Suppliers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<VerifiedFilter>('all');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const { data: suppliers, isLoading, error } = useQuery('suppliers', fetchSuppliers);
  const { darkMode } = useTheme();

  const filteredSuppliers = suppliers?.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesActive =
      activeFilter === 'all' ||
      (activeFilter === 'active' && supplier.active) ||
      (activeFilter === 'inactive' && !supplier.active);

    const matchesVerified =
      verifiedFilter === 'all' ||
      (verifiedFilter === 'verified' && supplier.verified) ||
      (verifiedFilter === 'unverified' && !supplier.verified);

    return matchesSearch && matchesActive && matchesVerified;
  });

  const inputClass = `px-4 py-2 rounded-lg border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors duration-300 ${
    darkMode
      ? 'bg-gray-800 text-light border-gray-700'
      : 'bg-white text-gray-800 border-gray-300'
  }`;

  if (isLoading) {
    return (
      <div
        className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-red-500 text-center">Failed to fetch suppliers</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-6">
          <h1
            className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}
          >
            Suppliers
          </h1>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by name, description, or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full ${inputClass}`}
                aria-label="Search suppliers"
              />
              <svg
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                } transition-colors duration-300`}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>

            {/* Active filter */}
            <div>
              <label htmlFor="active-filter" className="sr-only">
                Filter by status
              </label>
              <select
                id="active-filter"
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value as ActiveFilter)}
                className={inputClass}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Verified filter */}
            <div>
              <label htmlFor="verified-filter" className="sr-only">
                Filter by verification
              </label>
              <select
                id="verified-filter"
                value={verifiedFilter}
                onChange={(e) => setVerifiedFilter(e.target.value as VerifiedFilter)}
                className={inputClass}
              >
                <option value="all">All Verifications</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <p
            className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}
          >
            Showing {filteredSuppliers?.length ?? 0} supplier
            {filteredSuppliers?.length !== 1 ? 's' : ''}
          </p>

          {/* Empty state */}
          {(!filteredSuppliers || filteredSuppliers.length === 0) && (
            <div
              className={`flex flex-col items-center justify-center text-center py-20 rounded-lg ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
              role="status"
              aria-live="polite"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-12 w-12 mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p className={`${darkMode ? 'text-light' : 'text-gray-800'} text-lg font-medium`}>
                No suppliers found
              </p>
              {(searchTerm || activeFilter !== 'all' || verifiedFilter !== 'all') && (
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                  Try clearing or changing your search filters.
                </p>
              )}
            </div>
          )}

          {/* Supplier cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliers?.map((supplier) => (
              <button
                key={supplier.supplierId}
                onClick={() => setSelectedSupplier(supplier)}
                className={`${
                  darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                } rounded-lg shadow-lg p-6 text-left transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(118,184,82,0.3)] flex flex-col gap-3 focus:outline-none focus:ring-2 focus:ring-primary`}
                aria-label={`View details for ${supplier.name}`}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <h2
                    className={`text-lg font-semibold ${
                      darkMode ? 'text-light' : 'text-gray-800'
                    } transition-colors duration-300`}
                  >
                    {supplier.name}
                  </h2>
                  <div className="flex gap-1 shrink-0">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        supplier.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {supplier.active ? 'Active' : 'Inactive'}
                    </span>
                    {supplier.verified && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                <p
                  className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  } line-clamp-2 transition-colors duration-300`}
                >
                  {supplier.description}
                </p>

                {/* Contact details */}
                <div
                  className={`mt-auto space-y-1 text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  } transition-colors duration-300`}
                >
                  <p>
                    <span className="font-medium">Contact:</span> {supplier.contactPerson}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{' '}
                    <a
                      href={`mailto:${supplier.email}`}
                      className="text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {supplier.email}
                    </a>
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{' '}
                    <a
                      href={`tel:${supplier.phone}`}
                      className="text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {supplier.phone}
                    </a>
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Supplier detail modal */}
      {selectedSupplier && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedSupplier(null)}
          onKeyDown={(e) => e.key === 'Escape' && setSelectedSupplier(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Supplier details for ${selectedSupplier.name}`}
        >
          <div
            className={`${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } rounded-lg p-6 max-w-lg w-full shadow-xl transition-colors duration-300`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2
                className={`text-2xl font-bold ${
                  darkMode ? 'text-light' : 'text-gray-800'
                } transition-colors duration-300`}
              >
                {selectedSupplier.name}
              </h2>
              <button
                onClick={() => setSelectedSupplier(null)}
                className={`${
                  darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                } transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary rounded`}
                aria-label="Close supplier details"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  selectedSupplier.active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {selectedSupplier.active ? 'Active' : 'Inactive'}
              </span>
              {selectedSupplier.verified && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Verified
                </span>
              )}
            </div>

            <p
              className={`${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              } mb-6 transition-colors duration-300`}
            >
              {selectedSupplier.description}
            </p>

            <dl
              className={`space-y-3 text-sm ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              } transition-colors duration-300`}
            >
              <div className="flex gap-2">
                <dt className="font-medium w-28 shrink-0">Contact Person</dt>
                <dd>{selectedSupplier.contactPerson}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-medium w-28 shrink-0">Email</dt>
                <dd>
                  <a
                    href={`mailto:${selectedSupplier.email}`}
                    className="text-primary hover:underline"
                  >
                    {selectedSupplier.email}
                  </a>
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-medium w-28 shrink-0">Phone</dt>
                <dd>
                  <a
                    href={`tel:${selectedSupplier.phone}`}
                    className="text-primary hover:underline"
                  >
                    {selectedSupplier.phone}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}
