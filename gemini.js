import fetch from "node-fetch"

export async function handler(event) {
  try {
    const { calories } = JSON.parse(event.body)

    if (!calories) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Calories is required" })
      }
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `
أنت أخصائي تغذية محترف.
أنشئ جدول غذائي يومي باللغة العربية.
عدد السعرات: ${calories} سعرة حرارية.

الشروط:
- 3 وجبات رئيسية + 2 سناك
- أكل بسيط ومتوفّر
- اذكر الكميات
- مناسب للجيم

اكتب الجدول بشكل مرتب وواضح.
`
            }]
          }]
        })
      }
    )

    const json = await response.json()

    const plan =
      json?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "حدث خطأ أثناء توليد النظام الغذائي."

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan })
    }

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Server Error",
        details: error.message
      })
    }
  }
}
