exports.handler = async (event) => {
  try {
    console.log("RAW BODY:", event.body);

    let data = {};

    // Handle JSON (Elementor recommended)
    if (event.body) {
      const parsed = JSON.parse(event.body);
      data = parsed.data || parsed;
    }

    console.log("PARSED DATA:", data);

    const lead = {
      first_name: data.name || "",
      last_name: data.field_0969238 || "",
      email: data.email || "",
      phone: data.field_f5b411a || "",
      program: data.field_1b18630 || "",
      company: data.field_71c5fb3 || "",
      experience: data.field_126f704 || "",
      source: data.field_09e142c || "",
      message: data.field_9cc6a2c || "",
      privacy: data.field_9e6682a || "",
      consent: data.field_0ea1d66 || "",

      created_at: new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata"
      }),
      form_name: "training_form",
      referrer: event.headers.referer || ""
    };

    console.log("FINAL LEAD:", lead);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, lead })
    };

  } catch (error) {
    console.error("ERROR:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Something went wrong" })
    };
  }
};
