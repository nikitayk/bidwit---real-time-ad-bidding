# BIDWIT - Real-Time Bidding Analytics Dashboard

BIDWIT is a modern, AI-powered Real-Time Bidding (RTB) analytics dashboard designed to help users monitor, optimize, and visualize digital advertising campaign performance in real time.

## Features

- **Modern Dark Theme UI**: Sleek, responsive interface with dark mode for optimal viewing
- **Real-Time Analytics**: Monitor bid performance, CTR, and campaign metrics in real-time
- **Interactive Visualizations**: Rich data visualizations using Chart.js
- **Large Dataset Support**: Efficiently handle up to 2 million rows with virtual scrolling
- **Campaign Management**: Filter and analyze multiple campaigns
- **Secure Authentication**: User authentication and protected routes
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/bidwit.git
cd bidwit/bidwit-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

### Building for Production

To create a production build:

```bash
npm run build
```

The build files will be available in the `build` directory.

## Usage

### Authentication

1. Register a new account or log in with existing credentials
2. All dashboard features require authentication

### Importing Data

1. Prepare your bid data file in the following format:
```
<timestamp>,<ad_id>,<bid_price>,<CTR>,<win_status>
```
Example:
```
20130607000103501,88ea095ae6d01c3391bbba18a9601b36,300,6.000041961669922,5
```

2. Click the "Upload File" button on the dashboard
3. Select your data file
4. The dashboard will automatically process and visualize the data

### Features

- **Campaign Selection**: Choose from available campaigns
- **Date Range Filtering**: Filter data by custom date ranges
- **Real-Time Monitoring**: View live bid performance
- **Interactive Charts**:
  - CTR Trend Analysis
  - Bid Price Distribution
  - Win/Loss Ratio
  - Campaign Performance Metrics
- **Virtual Scrolling**: Efficiently handle large datasets
- **Export Options**: Download chart data in CSV or JSON format

## Technology Stack

- **Frontend Framework**: React.js with TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **UI Components**: Headless UI
- **Icons**: Heroicons
- **Date Handling**: react-datepicker
- **Virtual List**: react-virtualized
- **HTTP Client**: Axios

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers. 