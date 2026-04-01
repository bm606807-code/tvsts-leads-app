exports.handler = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "API is working" })
      };
    }

    const data = JSON.parse(event.body);

    const lead = {
      // USER FIELDS
      first_name: data.first_name || "",
      last_name: data.last_name || "",
      email: data.email || "",
      phone: data.phone || "",
      program: data.program || "",
      company: data.company || "",
      experience: data.experience || "",
      source: data.source || "",
      message: data.message || "",
      privacy: data.privacy || "",
      consent: data.consent || "",

      // AUTO FIELDS
      created_at: new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata"
      }),
      form_name: data.form_name || "training_form",
      referrer: data.referrer || ""
    };

    console.log("Final Lead:", lead);

    return {
      statusCode: 200,
      body: JSON.stringify(lead)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Something went wrong" })
    };
  }
};
