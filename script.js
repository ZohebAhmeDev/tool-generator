document.addEventListener('DOMContentLoaded', () => {
  const userInput = document.getElementById('userInput');
  const generateBtn = document.getElementById('generateBtn');
  const captionResult = document.getElementById('captionResult');
  let isGenerating = false;

  // 1. Direct API Call with Fallbacks
  async function generateCaptions(prompt) {
    // First try: Direct API call with local key
    try {
      let key = localStorage.getItem('OPENAI_KEY');
      if (!key) {
        key = prompt('🔑 Enter your OpenAI API key (get it at platform.openai.com/api-keys):');
        if (!key) throw new Error('No API key provided');
        localStorage.setItem('OPENAI_KEY', key);
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{
            role: "user",
            content: `Generate 3 Instagram captions about "${prompt}". Use emojis. Max 15 words each.`
          }],
          temperature: 0.7
        })
      });

      if (!response.ok) throw new Error('API request failed');
      return await response.json();

    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // 2. Click Handler
  generateBtn.addEventListener('click', async () => {
    if (isGenerating) return;
    
    const prompt = userInput.value.trim();
    if (!prompt) {
      captionResult.textContent = "⚠️ Please enter a topic!";
      return;
    }

    isGenerating = true;
    generateBtn.disabled = true;
    captionResult.innerHTML = "Generating... ⏳ (May take 10-20 seconds)";

    try {
      const result = await generateCaptions(prompt);
      captionResult.innerHTML = result.choices[0].message.content.replace(/\n/g, "<br>");
    } catch (error) {
      captionResult.innerHTML = `❌ Error: ${error.message}<br><br>
        Solutions:<br>
        1. <a href="https://platform.openai.com/api-keys" target="_blank">Get free API key</a><br>
        2. Ensure you have available credits<br>
        3. Check your internet connection`;
    } finally {
      isGenerating = false;
      generateBtn.disabled = false;
    }
  });
});
