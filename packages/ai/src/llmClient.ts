const endpoint = process.env.AZURE_PHI_ENDPOINT;
const deployment = process.env.AZURE_PHI_DEPLOYMENT;
const apiKey = process.env.AZURE_PHI_API_KEY;

if (!endpoint || !deployment || !apiKey) {
  // eslint-disable-next-line no-console
  console.warn("[ai] Azure Phi environment variables are not fully set.");
}

export async function callLLM(prompt: string): Promise<string> {
  if (!endpoint || !deployment || !apiKey) {
    throw new Error(
      "Azure Phi config missing (AZURE_PHI_ENDPOINT / AZURE_PHI_DEPLOYMENT / AZURE_PHI_API_KEY).",
    );
  }

  const response = await fetch(`${endpoint}chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      model: deployment,
      temperature: 0.4,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Azure Phi error ${response.status}: ${text}`);
  }

  const data: any = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Empty response from Azure Phi");
  }

  return content;
}


