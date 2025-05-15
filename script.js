document.addEventListener('DOMContentLoaded', () => {
  const userInput = document.getElementById('userInput');
  const generateBtn = document.getElementById('generateBtn');
  const captionResult = document.getElementById('captionResult');
  let isGenerating = false;

  async function generateCaptions(promptText) {
    try {
      let key = localStorage.getItem('OPENAI_KEY');
      if (!key) {
        key = window.prompt('🔑 Enter your OpenAI API key (get it at platform.openai.com/api-keys):');
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
            content: `Generate 3 Instagram captions about "${promptText}". Use emojis. Max 15 words each.`
          }],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'API request failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  generateBtn.addEventListener('click', async () => {
    if (isGenerating) return;
    
    const promptText = userInput.value.trim();
    if (!promptText) {
      captionResult.textContent = "⚠️ Please enter a topic!";
      return;
    }

    isGenerating = true;
    generateBtn.disabled = true;
    captionResult.innerHTML = "Generating... ⏳ (May take 10-20 seconds)";

    try {
      const result = await generateCaptions(promptText);
      captionResult.innerHTML = result.choices[0].message.content.replace(/\n/g, "<br>");
    } catch (error) {
      captionResult.innerHTML = `❌ Error: ${error.message}<br><br>
        Solutions:<br>
        1. <a href="https://platform.openai.com/api-keys" target="_blank">Get free API key</a><br>
        2. <a href="https://platform.openai.com/usage" target="_blank">Check credit balance</a><br>
        3. Try again later`;
    } finally {
      isGenerating = false;
      generateBtn.disabled = false;
    }
  });
});
