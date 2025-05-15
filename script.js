document.getElementById("generateBtn").addEventListener("click", async () => {
  const prompt = document.getElementById("userInput").value.trim();
  const resultDiv = document.getElementById("captionResult");

  if (!prompt) {
    resultDiv.textContent = "⚠️ Please enter a topic!";
    return;
  }

  resultDiv.textContent = "Generating... ⏳";

  try {
    const response = await fetch("/api/proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    resultDiv.innerHTML = data.choices[0].message.content.replace(
      /\n/g,
      "<br>"
    );
  } catch (error) {
    resultDiv.textContent =
      "✨ For unlimited access, add your free OpenAI key (takes 2 mins)";
    console.log("Full error:", error);
  }
});
