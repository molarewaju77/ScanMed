const LlamaStackChat = require('../llama-stack/llamaStackChat.js').default;

async function testLlamaStack() {
    console.log('='.repeat(50));
    console.log('Testing Llama Stack Integration');
    console.log('='.repeat(50));

    const llamaStack = new LlamaStackChat();

    // Test 1: Health Check
    console.log('\n1. Checking Llama Stack server status...');
    const health = await llamaStack.checkHealth();

    if (!health.serverRunning) {
        console.error('❌ Llama Stack server is not running!');
        console.log('\nTo fix:\n  1. Start server: llama stack run --port 5001\n  2. Keep terminal open\n  3. Run this test again\n');
        console.log(`\nError: ${health.error}`);
        console.log(`Suggestion: ${health.suggestion}`);
        process.exit(1);
    }

    console.log('✅ Llama Stack server is running');
    console.log(`   Base URL: ${health.baseUrl}`);
    console.log(`   Model: ${health.model}`);

    // Test 2: Chat Message
    console.log('\n2. Testing chat with Llama 4 Scout...');
    try {
        const response = await llamaStack.sendMessage(
            [],
            'What is one common symptom of high blood pressure? Answer in 10 words or less.',
            'en'
        );
        console.log('✅ Chat works!');
        console.log(`   Response: ${response.substring(0, 100)}...`);
    } catch (error) {
        console.error('❌ Chat failed:', error.message);
        if (error.message.includes('ECONNREFUSED')) {
            console.log('\nMake sure Llama Stack server is running:');
            console.log('  llama stack run --port 5001');
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log('Llama Stack Integration Test Complete!');
    console.log('='.repeat(50));
}

testLlamaStack().catch(error => {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
});
