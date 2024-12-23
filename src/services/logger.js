export function logLecturerResponse(lecturer, response) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Response from ${lecturer.name}:`);
    console.log(`  Subject: ${lecturer.subject}`);
    console.log(`  Response: ${response}`);
    console.log('----------------------------------------');
  }