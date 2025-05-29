interface BidData {
  timestamp: string;
  adId: string;
  bidPrice: number;
  ctr: number;
  winStatus: boolean;
}

export async function processLine(line: string): Promise<BidData> {
  // Parse the line (comma-separated values)
  const parts = line.split(',').map(part => part.trim());

  // Validate we have all parts
  if (parts.length < 5) {
    throw new Error(`Invalid data format. Expected 5 fields but got ${parts.length}`);
  }

  const [timestamp, adId, bidPrice, ctr, winStatus] = parts;

  try {
    // Format timestamp (YYYYMMDDHHMMSS format)
    const formattedTimestamp = timestamp.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2}).*/, '$1-$2-$3T$4:$5:$6Z');

    // Convert and validate types
    const data: BidData = {
      timestamp: formattedTimestamp,
      adId: adId,
      bidPrice: parseInt(bidPrice, 10), // Convert to integer as it seems to be in cents
      ctr: parseFloat(ctr),
      winStatus: parseInt(winStatus, 10) > 0 // Convert numeric value to boolean
    };

    // Validate numeric values
    if (isNaN(data.bidPrice) || isNaN(data.ctr)) {
      throw new Error('Invalid numeric values');
    }

    // Convert bid price from cents to dollars for display
    data.bidPrice = data.bidPrice / 100;

    // Validate ranges
    if (data.bidPrice < 0) throw new Error('Bid price cannot be negative');
    if (data.ctr < 0) throw new Error('CTR cannot be negative');

    console.log('Successfully processed line:', data);
    return data;
  } catch (error) {
    console.error('Error processing line data:', error);
    throw error;
  }
} 