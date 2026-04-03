exports.handler = async (event) => {
  try {
    console.log("RAW BODY:", event.body);

    let data = {};

    // ✅ Handle BOTH JSON & form-data
    try {
      data = JSON.parse(event.body);
    } catch (e) {
      const params = new URLSearchParams(event.body);
      params.forEach((value, key) => {
        data[key] = value;
      });
    }

    console.log("PARSED DATA:", data);

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

    // ✅ Send to API
    await fetch("https://tvstsleadsnew.netlify.app/.netlify/functions/api-leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(lead)
    });

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
