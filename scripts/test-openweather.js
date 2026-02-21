require('dotenv').config({ path: '.env.local' });

async function testAPI() {
  console.log(' Testing OpenWeatherMap API...');
  console.log('=================================');
  
  // Get API key from environment
  const apiKey = process.env.OPENWEATHER_API_KEY;
  
  if (!apiKey) {
    console.log(' No API key found in .env.local');
    console.log('Please add OPENWEATHER_API_KEY to your .env.local file');
    return;
  }
  
  console.log('API Key found:', apiKey.substring(0, 5) + '...' + apiKey.substring(apiKey.length - 5));
  console.log(' API Key length:', apiKey.length);
  
  // Test 1: Current Weather API
  console.log('\n1️⃣ Testing Current Weather API...');
  console.log('---------------------------------');
  
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=40.7128&lon=-74.0060&appid=${apiKey}&units=metric`;
  console.log('🌐 URL (without key):', weatherUrl.replace(apiKey, 'HIDDEN'));
  
  try {
    const startTime = Date.now();
    const weatherRes = await fetch(weatherUrl);
    const endTime = Date.now();
    
    console.log('⏱️  Response time:', endTime - startTime, 'ms');
    console.log('📡 Response status:', weatherRes.status);
    
    const weatherData = await weatherRes.json();
    
    if (weatherRes.ok) {
      console.log('✅ Weather API SUCCESS!');
      console.log('   Location:', weatherData.name);
      console.log('   Country:', weatherData.sys?.country);
      console.log('   Temperature:', weatherData.main?.temp, '°C');
      console.log('   Feels like:', weatherData.main?.feels_like, '°C');
      console.log('   Humidity:', weatherData.main?.humidity, '%');
      console.log('   Conditions:', weatherData.weather?.[0]?.description);
      console.log('   Wind Speed:', weatherData.wind?.speed, 'm/s');
    } else {
      console.log('❌ Weather API FAILED:');
      console.log(JSON.stringify(weatherData, null, 2));
    }
  } catch (error) {
    console.log('❌ Weather API error:', error.message);
  }
  
  // Test 2: Air Pollution API
  console.log('\n2️⃣ Testing Air Pollution API...');
  console.log('---------------------------------');
  
  const airUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=40.7128&lon=-74.0060&appid=${apiKey}`;
  console.log('🌐 URL (without key):', airUrl.replace(apiKey, 'HIDDEN'));
  
  try {
    const startTime = Date.now();
    const airRes = await fetch(airUrl);
    const endTime = Date.now();
    
    console.log('⏱️  Response time:', endTime - startTime, 'ms');
    console.log('📡 Response status:', airRes.status);
    
    const airData = await airRes.json();
    
    if (airRes.ok) {
      console.log('✅ Air Pollution API SUCCESS!');
      console.log('   AQI (1-5 scale):', airData.list[0]?.main?.aqi);
      console.log('   PM2.5:', airData.list[0]?.components?.pm2_5, 'µg/m³');
      console.log('   PM10:', airData.list[0]?.components?.pm10, 'µg/m³');
      console.log('   O₃:', airData.list[0]?.components?.o3, 'µg/m³');
    } else {
      console.log('❌ Air Pollution API FAILED:');
      console.log(JSON.stringify(airData, null, 2));
    }
  } catch (error) {
    console.log('❌ Air Pollution API error:', error.message);
  }
  
  console.log('\n=================================');
  console.log('🏁 Test complete!');
}

// Run the test
testAPI();

