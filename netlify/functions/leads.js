exports.handler = async (event) => {
  try {
    const params = new URLSearchParams(event.body);
    let data = {};

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

    // Send to API
    await fetch("https://tvstsleadsnew.netlify.app/.netlify/functions/api/leads", {
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
    console.error(error);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: false })
    };
  }
};
