exports.handler = async (event) => {
  try {
    console.log("RAW BODY:", event.body);

    let data = {};

    // Handle URL-encoded (Elementor default)
    const params = new URLSearchParams(event.body);

    params.forEach((value, key) => {
      data[key] = value;
    });

    console.log("PARSED DATA:", data);

    const lead = {
      name: (data["First Name"] || "") + " " + (data["Last Name"] || ""),
      email: data["Email"] || "",
      phone: data["Mobile Number"] || "",
      company: data["Company Name & Department"] || "",
      message: data["Type your message here..."] || "",
      referrer: data["Page URL"] || "",
      category: "B2B" // you can customize later
    };

    console.log("FINAL LEAD:", lead);

    // 🔥 SEND DATA TO YOUR DASHBOARD API
    const response = await fetch("https://tvstsleadsnew.netlify.app/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY // safer
      },
      body: JSON.stringify(lead)
    });

    const result = await response.text();
    console.log("API RESPONSE:", result);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch (error) {
    console.error("ERROR:", error);

    return {
      statusCode: 200, // IMPORTANT for Elementor
      body: JSON.stringify({ success: false })
    };
  }
};
