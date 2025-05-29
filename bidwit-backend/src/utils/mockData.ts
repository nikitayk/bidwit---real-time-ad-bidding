export const generateMockAnalytics = (timeRange: string) => {
  // Generate random data based on time range
  const generateRandomChange = () => {
    const baseValue = Math.random() * 1000;
    return {
      current: Math.round(baseValue * 1.1),
      previous: Math.round(baseValue),
    };
  };

  return {
    revenue: generateRandomChange(),
    impressions: generateRandomChange(),
    clicks: generateRandomChange(),
    conversions: generateRandomChange(),
  };
}; 