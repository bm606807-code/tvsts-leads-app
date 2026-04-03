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
      first_name: data["First Name"] || "",
      last_name: data["Last Name"] || "",
      email: data["Email"] || "",
      phone: data["Mobile Number"] || "",
      program: data["Select Program"] || "",
      company: data["Company Name & Department"] || "",
      experience: data["Years of Work Experience"] || "",
      source: data["How did you know about this?"] || "",
      message: data["Type your message here..."] || "",
      privacy: data["Agreed to Privacy Policy"] || "",
      consent: data["Agreed to TVS Training and Services"] || "",

      created_at: data["Date"] + " " + data["Time"] || "",
      form_name: data["form_name"] || "",
      referrer: data["Page URL"] || ""
    };

    console.log("FINAL LEAD:", lead);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, lead })
    };

  } catch (error) {
    console.error("ERROR:", error);

    return {
      statusCode: 200, // IMPORTANT: avoid Elementor failure
      body: JSON.stringify({ success: false })
    };
  }
};
