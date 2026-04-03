exports.handler = async (event) => {
  try {
    console.log("RAW BODY:", event.body);

    let data = {};

    const params = new URLSearchParams(event.body);
    params.forEach((value, key) => {
      data[key] = value;
    });

    const lead = {
      name: (data["First Name"] || "") + " " + (data["Last Name"] || ""),
      email: data["Email"] || "",
      phone: data["Mobile Number"] || "",
      company: data["Company Name & Department"] || "",
      message: data["Type your message here..."] || "",
      referrer: data["Page URL"] || "",
      category: "B2B"
    };

    console.log("FINAL LEAD:", lead);

    // ✅ FIXED URL HERE
    const response = await fetch("https://tvstsleadsnew.netlify.app/.netlify/functions/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.LEAD_API_KEY
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
      statusCode: 200,
      body: JSON.stringify({ success: false })
    };
  }
};
