// This will run on GitHub's servers for free
export default async (req, res) => {
  const { prompt } = req.body;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Generate 3 Instagram captions about "${prompt}". Use emojis. Max 15 words each.`,
        },
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  res.status(200).json(data);
};
