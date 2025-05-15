// script.js - Secure Version for GitHub Pages
document.addEventListener('DOMContentLoaded', () => {
  const userInput = document.getElementById('userInput');
  const generateBtn = document.getElementById('generateBtn');
  const captionResult = document.getElementById('captionResult');
  const keyStatus = document.createElement('div');
  keyStatus.className = 'key-status';
  document.body.prepend(keyStatus);

  // Check for GitHub Actions proxy
  let usingGitHubProxy = false;

  generateBtn.addEventListener('click', async () => {
    const prompt = userInput.value.trim();
    
    if (!prompt) {
      captionResult.textContent = "⚠️ Please enter a topic!";
      return;
    }

    captionResult.textContent = "Generating... ⏳";
    generateBtn.disabled = true;

    try {
      // Try GitHub Actions proxy first
      const response = await fetch('https://your-github-username.github.io/your-repo/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) throw new Error('GitHub proxy failed');
      
      const data = await response.json();
      captionResult.innerHTML = data.choices[0].message.content.replace(/\n/g, "<br>");
      usingGitHubProxy = true;
      keyStatus.textContent = "🔒 Using secure GitHub proxy";
      keyStatus.style.color = "green";

    } catch (error) {
      // Fallback to local key if proxy fails
      if (!localStorage.getItem('OPENAI_KEY')) {
        const key = prompt('🔑 Enter your OpenAI key (or setup GitHub Secrets for auto-proxy):');
        if (key) localStorage.setItem('OPENAI_KEY', key);
      }

      if (localStorage.getItem('OPENAI_KEY')) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('OPENAI_KEY')}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{
              role: "user",
              content: `Generate 3 Instagram captions about "${prompt}". Use emojis. Max 15 words each.`
            }]
          })
        });
        
        const data = await response.json();
        captionResult.innerHTML = data.choices[0].message.content.replace(/\n/g, "<br>");
        keyStatus.textContent = "⚠️ Using local key (setup GitHub Secrets for better security)";
        keyStatus.style.color = "orange";
      } else {
        captionResult.innerHTML = `🔴 <strong>Setup required:</strong><br>
          1. <a href="https://platform.openai.com/api-keys" target="_blank">Get OpenAI key</a><br>
          2. Add to GitHub Secrets (recommended) or paste here temporarily`;
      }
    } finally {
      generateBtn.disabled = false;
    }
  });
});
