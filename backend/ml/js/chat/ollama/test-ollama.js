const OllamaChat = require('../ollama/ollamaChat.js').default;

async function testOllama() {
    console.log('='.repeat(50));
    console.log('Testing Ollama Integration');
    console.log('='.repeat(50));

    const ollama = new OllamaChat();

    // Test 1: Health Check
    console.log('\n1. Checking Ollama server status...');
    const health = await ollama.checkHealth();

    if (!health.serverRunning) {
        console.error('❌ Ollama server is not running!');
        console.log('\nTo fix:\n  1. Start Ollama: ollama serve\n  2. Keep terminal open\n  3. Run this test again\n');
        process.exit(1);
    }

    console.log('✅ Ollama server is running');
    console.log(`   Available models: ${health.availableModels.join(', ')}`);

    if (!health.modelAvailable) {
        console.warn(`⚠️  Model '${ollama.model}' not found`);
        console.log(`\nTo fix: ollama pull ${ollama.model}\n`);
    } else {
        console.log(`✅ Model '${ollama.model}' is available`);
    }

    if (!health.visionModelAvailable) {
        console.warn(`⚠️  Vision model '${ollama.visionModel}' not found`);
        console.log(`\nTo fix: ollama pull ${ollama.visionModel}\n`);
    } else {
        console.log(`✅ Vision model '${ollama.visionModel}' is available`);
    }

    // Test 2: Chat Message
    if (health.modelAvailable) {
        console.log('\n2. Testing chat...');
        try {
            const response = await ollama.sendMessage([], 'Tell me one symptom of diabetes in 10 words or less.', 'en');
            console.log('✅ Chat works!');
            console.log(`   Response: ${response.substring(0, 100)}...`);
        } catch (error) {
            console.error('❌ Chat failed:', error.message);
        }
    }

    // Test 3: Vision (if available)
    if (health.visionModelAvailable) {
        console.log('\n3. Testing vision model...');
        console.log('   (Skipped - requires image file)');
        console.log('   ✅ Vision model is ready for use');
    }

    console.log('\n' + '='.repeat(50));
    console.log('Ollama Integration Test Complete!');
    console.log('='.repeat(50));
}

testOllama().catch(error => {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
});
