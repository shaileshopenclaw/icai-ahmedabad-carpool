import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

// Try to load .env.local manually
const env = dotenv.parse(fs.readFileSync('.env.local'));
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function diagnose() {
  console.log('--- Diagnosing Search Issue ---');
  
  // 1. Fetch some sample data to see the format
  console.log('Fetching sample participants...');
  const { data: samples, error: sampleErr } = await supabase
    .from('participants')
    .select('name, pincode, area_name')
    .limit(10);
    
  if (sampleErr) {
    console.error('Error fetching samples:', sampleErr);
    return;
  }
  
  console.log('Sample Data (first 10):');
  console.table(samples);

  // 2. Test the query for a specific pincode from the sample
  if (samples.length > 0) {
    const testPincode = samples[0].pincode;
    console.log(`\nTesting search for pincode: "${testPincode}"`);
    
    const startTime = Date.now();
    const { data, error, status } = await supabase
      .from('participants')
      .select('*, events(title)')
      .or(`pincode.eq.${testPincode},area_name.ilike.%${testPincode}%`)
      .order('created_at', { ascending: false })
      .limit(50);
    const endTime = Date.now();
    
    if (error) {
      console.error('Error during test query:', error);
    } else {
      console.log(`Query took ${endTime - startTime}ms`);
      console.log(`Found ${data.length} results`);
    }
  } else {
    console.log('No data found in participants table.');
  }
}

diagnose();
