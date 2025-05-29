import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal = ({ isOpen, onClose }: HelpModalProps) => {
  const sections = [
    {
      title: 'Getting Started',
      content: [
        {
          question: 'How do I import campaign data?',
          answer: 'Click the "Import Data" button and select your output.txt file. The file should follow the format: <timestamp>,<ad_id>,<bid_price>,<CTR>,<win_status>',
        },
        {
          question: 'What is the N-Factor?',
          answer: 'The N-Factor controls bid aggressiveness. Higher values increase bid amounts, potentially winning more auctions but at higher costs. Lower values optimize for cost efficiency.',
        },
      ],
    },
    {
      title: 'Understanding Metrics',
      content: [
        {
          question: 'What is CTR (Click-Through Rate)?',
          answer: 'CTR measures the percentage of users who clicked on your ad after seeing it. It\'s calculated as (Total Clicks / Total Impressions) × 100. A higher CTR indicates more engaging ads.',
        },
        {
          question: 'What is CVR (Conversion Rate)?',
          answer: 'CVR shows the percentage of users who completed a desired action (conversion) after clicking your ad. It\'s calculated as (Total Conversions / Total Clicks) × 100.',
        },
        {
          question: 'How is Average Execution Time calculated?',
          answer: 'Average Execution Time is the mean time taken to process bid requests, measured in milliseconds. Lower execution times indicate better system performance.',
        },
        {
          question: 'What does Budget Usage indicate?',
          answer: 'Budget Usage shows your spending progress as a percentage of your total budget. It includes spent amount, remaining budget, and a visual progress indicator.',
        },
      ],
    },
    {
      title: 'Real-Time Updates',
      content: [
        {
          question: 'How does the Live Bid Console work?',
          answer: 'The Live Bid Console shows real-time bid outcomes including timestamp, bid ID, advertiser, bid price, execution time, and outcome (won/lost/no-bid). It automatically scrolls to show the latest bids.',
        },
        {
          question: 'How long do live updates run?',
          answer: 'Live updates automatically run for 1 minute to preserve system resources. You can manually stop updates at any time using the Stop button.',
        },
        {
          question: 'What metrics are updated in real-time?',
          answer: 'All dashboard metrics including CTR, bid outcomes, performance indicators, and budget usage are updated in real-time when live updates are enabled.',
        },
      ],
    },
    {
      title: 'Performance Analysis',
      content: [
        {
          question: 'How can I analyze bid performance?',
          answer: 'Monitor the CTR trend chart, win/loss ratio, and bid price distribution. High CTR with a good win rate suggests effective bidding strategy.',
        },
        {
          question: 'What is a good CTR?',
          answer: 'CTR benchmarks vary by industry, but generally 1-2% is considered average. Above 2% is good, while above 5% is excellent.',
        },
        {
          question: 'How can I optimize my bidding strategy?',
          answer: 'Analyze patterns in successful bids, adjust N-Factor based on performance, and monitor budget usage. Consider increasing bids during high-CTR periods.',
        },
      ],
    },
    {
      title: 'Data Management',
      content: [
        {
          question: 'How many rows of data can the system handle?',
          answer: 'The dashboard is optimized to handle up to 2 million rows of data efficiently using virtual scrolling and pagination.',
        },
        {
          question: 'Can I export my data?',
          answer: 'Yes, you can export your data in CSV or JSON format using the Export button in the dashboard header.',
        },
        {
          question: 'How often should I analyze my data?',
          answer: 'Regular monitoring is recommended. Check real-time metrics daily and perform detailed analysis weekly or monthly depending on campaign volume.',
        },
      ],
    },
    {
      title: 'Troubleshooting',
      content: [
        {
          question: 'Why are some bids showing "no-bid"?',
          answer: 'No-bid responses occur when bid requirements aren\'t met (e.g., budget constraints, targeting criteria) or when the system cannot process the request in time.',
        },
        {
          question: 'What causes high execution times?',
          answer: 'High execution times may result from system load, complex bidding rules, or network latency. Monitor patterns and optimize if consistently high.',
        },
        {
          question: 'How can I reduce costs while maintaining performance?',
          answer: 'Balance your N-Factor setting, target high-CTR inventory, and set appropriate bid caps. Monitor CVR to ensure quality conversions.',
        },
      ],
    },
  ];

  return (
    <Transition.Root show={isOpen} as={Fragment}>
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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-dark-bg-secondary px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-dark-bg-secondary text-dark-text-secondary hover:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-2xl font-semibold leading-6 text-dark-text-primary mb-8">
                      BIDWIT Help Guide
                    </Dialog.Title>
                    <div className="mt-2 space-y-8">
                      {sections.map((section) => (
                        <div key={section.title} className="space-y-4">
                          <h4 className="text-lg font-medium text-dark-text-primary">{section.title}</h4>
                          <dl className="space-y-4">
                            {section.content.map((item) => (
                              <div key={item.question} className="bg-dark-bg-tertiary rounded-lg p-4">
                                <dt className="text-dark-text-primary font-medium mb-2">{item.question}</dt>
                                <dd className="text-dark-text-secondary">{item.answer}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default HelpModal; 