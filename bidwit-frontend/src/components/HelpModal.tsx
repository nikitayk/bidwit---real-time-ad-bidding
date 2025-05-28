import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function HelpModal({ isOpen, onClose }: HelpModalProps) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed z-50 inset-0 overflow-y-auto" onClose={onClose}>
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-dark-bg-secondary rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="rounded-md text-dark-text-secondary hover:text-dark-text-primary focus:outline-none"
                  onClick={onClose}
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <Dialog.Title as="h3" className="text-2xl leading-6 font-semibold text-dark-text-primary mb-6">
                    BIDWIT Help Guide
                  </Dialog.Title>

                  <div className="mt-4 space-y-8 text-dark-text-primary">
                    <section>
                      <h4 className="text-lg font-medium mb-3">Getting Started</h4>
                      <p className="text-dark-text-secondary mb-4">
                        BIDWIT is a real-time bidding analytics dashboard that helps you monitor and optimize your digital advertising campaigns. The platform provides comprehensive insights into your campaign performance through interactive visualizations and real-time metrics.
                      </p>
                    </section>

                    <section>
                      <h4 className="text-lg font-medium mb-3">Dashboard Controls</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-dark-text-secondary">
                        <div>
                          <h5 className="font-medium text-dark-text-primary mb-2">Campaign Selection</h5>
                          <p className="mb-2">Choose your active campaign from the dropdown menu to view campaign-specific metrics and analytics.</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-dark-text-primary mb-2">Date Range</h5>
                          <p className="mb-2">Filter your data by selecting custom start and end dates to focus on specific time periods.</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-dark-text-primary mb-2">Live Updates</h5>
                          <p className="mb-2">Toggle real-time updates to see your metrics refresh automatically. Updates will automatically stop after 1 minute to preserve resources.</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-dark-text-primary mb-2">Export Data</h5>
                          <p className="mb-2">Download your campaign data in CSV or JSON format for further analysis in external tools.</p>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h4 className="text-lg font-medium mb-3">Importing Data</h4>
                      <div className="text-dark-text-secondary">
                        <p className="mb-2">To import your campaign data:</p>
                        <ol className="list-decimal list-inside space-y-2">
                          <li>Click the "Upload File" button in the control panel</li>
                          <li>Select your output.txt file</li>
                          <li>Ensure your file follows the format:
                            <code className="block bg-dark-bg-tertiary p-2 mt-1 rounded-md">
                              timestamp,ad_id,bid_price,CTR,win_status
                            </code>
                          </li>
                          <li>Example:
                            <code className="block bg-dark-bg-tertiary p-2 mt-1 rounded-md">
                              20130607000103501,88ea095ae6d01c3391bbba18a9601b36,300,6.000041961669922,5
                            </code>
                          </li>
                        </ol>
                      </div>
                    </section>

                    <section>
                      <h4 className="text-lg font-medium mb-3">Understanding Metrics</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-dark-text-secondary">
                        <div>
                          <h5 className="font-medium text-dark-text-primary mb-2">Key Performance Indicators</h5>
                          <dl className="space-y-2">
                            <dt className="font-medium">Impressions</dt>
                            <dd className="ml-4">Total number of ad impressions served</dd>
                            
                            <dt className="font-medium">CTR (Click-Through Rate)</dt>
                            <dd className="ml-4">Percentage of impressions that resulted in clicks</dd>
                            
                            <dt className="font-medium">CVR (Conversion Rate)</dt>
                            <dd className="ml-4">Percentage of clicks that resulted in conversions</dd>
                            
                            <dt className="font-medium">CPC (Cost per Click)</dt>
                            <dd className="ml-4">Average cost per click across all campaigns</dd>
                          </dl>
                        </div>
                        <div>
                          <h5 className="font-medium text-dark-text-primary mb-2">Budget Metrics</h5>
                          <dl className="space-y-2">
                            <dt className="font-medium">Budget Usage</dt>
                            <dd className="ml-4">Visual representation of spent vs remaining budget</dd>
                            
                            <dt className="font-medium">Average Bid Price</dt>
                            <dd className="ml-4">Mean bid amount across all auctions</dd>
                            
                            <dt className="font-medium">Win/Loss Ratio</dt>
                            <dd className="ml-4">Proportion of successful bids vs unsuccessful ones</dd>
                          </dl>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h4 className="text-lg font-medium mb-3">Visualizations</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-dark-text-secondary">
                        <div>
                          <h5 className="font-medium text-dark-text-primary mb-2">Charts</h5>
                          <ul className="list-disc list-inside space-y-1">
                            <li>CTR Trend: Track click-through rate changes over time</li>
                            <li>Bid Price Distribution: Analyze bid price patterns</li>
                            <li>Win/Loss Ratio: Monitor auction success rates</li>
                            <li>Budget Usage Ring: Visual budget tracking</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-dark-text-primary mb-2">Live Console</h5>
                          <p>Real-time feed showing individual bid outcomes with:
                            <ul className="list-disc list-inside mt-1">
                              <li>Timestamp</li>
                              <li>Ad ID</li>
                              <li>Bid amount</li>
                              <li>Win/Loss status (color-coded)</li>
                            </ul>
                          </p>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h4 className="text-lg font-medium mb-3">Optimization Tips</h4>
                      <ul className="list-disc list-inside text-dark-text-secondary space-y-2">
                        <li>Monitor CTR trends to identify high-performing periods</li>
                        <li>Use the bid price distribution to optimize your bidding strategy</li>
                        <li>Track your win/loss ratio to adjust bid aggressiveness</li>
                        <li>Keep an eye on your budget usage to maintain campaign efficiency</li>
                        <li>Export data regularly for deeper analysis and reporting</li>
                      </ul>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default HelpModal; 