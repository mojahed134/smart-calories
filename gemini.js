export async function handler(event) {
  try {
    const { calories } = JSON.parse(event.body)

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `أنت أخصائي تغذية. أنشئ جدول غذائي يومي بالعربي بعدد ${calories} سعرة.`
            }]
          }]
        })
      }
    )

    const json = await response.json()

    return {
      statusCode: 200,
      body: JSON.stringify({
        plan: json.candidates[0].content.parts[0].text
      })
    }
  } catch (e) {
    return { statusCode: 500, body: e.message }
  }
}
