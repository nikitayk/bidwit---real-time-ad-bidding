import { processLine } from './utils/processData';
import fs from 'fs';
import path from 'path';

async function testProcessing() {
  try {
    const testLine = '20130607000103501,88ea095ae6d01c3391bbba18a9601b36,300,6.000041961669922,5';
    const result = await processLine(testLine);
    console.log('Processed data:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

testProcessing(); 