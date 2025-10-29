// utils/networkTest.ts
export const testNetworkConnection = async () => {
  const testUrls = [
    'http://localhost:3000',
    'http://10.0.2.2:3000', // Android emulator
    'http://127.0.0.1:3000',
  ];

  for (const url of testUrls) {
    try {
      console.log(`🔄 Testing connection to: ${url}`);
      const response = await fetch(`${url}/health`); // Create a health endpoint on your server
      if (response.ok) {
        console.log(`✅ Server is reachable at: ${url}`);
        return url;
      }
    } catch (error) {
      console.log(`❌ Cannot reach: ${url}`, error);
    }
  }
  
  console.log('❌ No server connection established');
  return null;
};