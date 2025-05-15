document.addEventListener('DOMContentLoaded', () => {
  const userInput = document.getElementById('userInput');
  const generateBtn = document.getElementById('generateBtn');
  const captionResult = document.getElementById('captionResult');
  
  // 1. FIRST TRY: GitHub Pages Proxy
  async function tryGitHubProxy(prompt) {
    try {
      const response = await fetch('/api/proxy', {  // Relative path for GH Pages
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      return await response.json();
    } catch (error) {
      console.log("GitHub proxy failed, trying fallback...");
      return null;
    }
  }

  // 2. FALLBACK: Direct API with local key
  async function tryLocalKey(prompt) {
    let key = localStorage.getItem('OPENAI_KEY');
    if (!key) {
      key = prompt('🔐 Enter your OpenAI API key (from platform.openai.com/api-keys):');
      if (!key) throw new Error('No key provided');
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
        }]
      })
    });
    return await response.json();
  }

  generateBtn.addEventListener('click', async () => {
    const prompt = userInput.value.trim();
    if (!prompt) {
      captionResult.textContent = "⚠️ Please enter a topic!";
      return;
    }

    captionResult.innerHTML = "Generating... ⏳";
    generateBtn.disabled = true;

    try {
      // Try GitHub proxy first
      let result = await tryGitHubProxy(prompt);
      
      // Fallback to local key if needed
      if (!result) result = await tryLocalKey(prompt);
      
      captionResult.innerHTML = result.choices[0].message.content.replace(/\n/g, "<br>");
    } catch (error) {
      captionResult.innerHTML = `❌ Error: ${error.message}<br><br>
        Solutions:<br>
        1. <a href="https://platform.openai.com/api-keys" target="_blank">Get free API key</a><br>
        2. Paste it when prompted<br>
        3. <a href="https://docs.github.com/en/actions/security-guides/encrypted-secrets" target="_blank">Or setup GitHub Secrets</a>`;
    } finally {
      generateBtn.disabled = false;
    }
  });
});
