import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { DocumentTextIcon, TableCellsIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ImportGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportGuide = ({ isOpen, onClose }: ImportGuideProps) => {
  const sampleData = `timestamp,ad_id,bid_price,ctr,win_status,execution_time
2024-03-21T10:00:00Z,ad123,250.50,4.5,1,120
2024-03-21T10:01:00Z,ad124,180.75,3.2,0,95
2024-03-21T10:02:00Z,ad125,320.25,5.1,1,150`;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-dark-bg-primary p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="div" className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-dark-text-primary">
                    Data Import Guide
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-dark-text-secondary hover:text-dark-text-primary"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </Dialog.Title>

                <div className="space-y-6">
                  {/* File Format Section */}
                  <section>
                    <h4 className="text-md font-medium text-dark-text-primary mb-2 flex items-center">
                      <DocumentTextIcon className="h-5 w-5 mr-2" />
                      Supported File Format
                    </h4>
                    <div className="bg-dark-bg-secondary p-4 rounded-lg">
                      <ul className="list-disc list-inside text-dark-text-secondary space-y-2">
                        <li>CSV (Comma-Separated Values) files</li>
                        <li>UTF-8 encoding</li>
                        <li>First row must contain headers</li>
                        <li>File size limit: 10MB</li>
                      </ul>
                    </div>
                  </section>

                  {/* Required Fields Section */}
                  <section>
                    <h4 className="text-md font-medium text-dark-text-primary mb-2 flex items-center">
                      <TableCellsIcon className="h-5 w-5 mr-2" />
                      Required Fields
                    </h4>
                    <div className="bg-dark-bg-secondary p-4 rounded-lg">
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr className="border-b border-dark-border">
                              <th className="text-left py-2 px-4 text-dark-text-primary">Field</th>
                              <th className="text-left py-2 px-4 text-dark-text-primary">Type</th>
                              <th className="text-left py-2 px-4 text-dark-text-primary">Description</th>
                            </tr>
                          </thead>
                          <tbody className="text-dark-text-secondary">
                            <tr className="border-b border-dark-border">
                              <td className="py-2 px-4">timestamp</td>
                              <td className="py-2 px-4">ISO 8601 datetime</td>
                              <td className="py-2 px-4">Bid timestamp (e.g., 2024-03-21T10:00:00Z)</td>
                            </tr>
                            <tr className="border-b border-dark-border">
                              <td className="py-2 px-4">ad_id</td>
                              <td className="py-2 px-4">string</td>
                              <td className="py-2 px-4">Unique identifier for the ad</td>
                            </tr>
                            <tr className="border-b border-dark-border">
                              <td className="py-2 px-4">bid_price</td>
                              <td className="py-2 px-4">number</td>
                              <td className="py-2 px-4">Bid amount in USD</td>
                            </tr>
                            <tr className="border-b border-dark-border">
                              <td className="py-2 px-4">ctr</td>
                              <td className="py-2 px-4">number</td>
                              <td className="py-2 px-4">Click-through rate (percentage)</td>
                            </tr>
                            <tr className="border-b border-dark-border">
                              <td className="py-2 px-4">win_status</td>
                              <td className="py-2 px-4">number (0 or 1)</td>
                              <td className="py-2 px-4">Bid outcome (1 = won, 0 = lost)</td>
                            </tr>
                            <tr>
                              <td className="py-2 px-4">execution_time</td>
                              <td className="py-2 px-4">number</td>
                              <td className="py-2 px-4">Bid execution time in milliseconds</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </section>

                  {/* Sample Data Section */}
                  <section>
                    <h4 className="text-md font-medium text-dark-text-primary mb-2">Sample Data</h4>
                    <div className="bg-dark-bg-secondary p-4 rounded-lg">
                      <pre className="text-dark-text-secondary overflow-x-auto whitespace-pre-wrap">
                        {sampleData}
                      </pre>
                    </div>
                  </section>

                  {/* Tips Section */}
                  <section>
                    <h4 className="text-md font-medium text-dark-text-primary mb-2">Tips</h4>
                    <div className="bg-dark-bg-secondary p-4 rounded-lg">
                      <ul className="list-disc list-inside text-dark-text-secondary space-y-2">
                        <li>Ensure all required fields are present and properly formatted</li>
                        <li>Use consistent date format across all entries</li>
                        <li>Validate numeric fields contain only numbers</li>
                        <li>Remove any empty rows or special characters</li>
                      </ul>
                    </div>
                  </section>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ImportGuide; 