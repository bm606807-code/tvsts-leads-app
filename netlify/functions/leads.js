exports.handler = async (event) => {
  try {
    let data = {};

    // ✅ HANDLE ELEMENTOR FORM DATA
    if (event.headers["content-type"]?.includes("application/json")) {
      data = JSON.parse(event.body);
    } else {
      const params = new URLSearchParams(event.body);
      data = Object.fromEntries(params.entries());
    }

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
      form_name: data.form_name || "training_form",
      referrer: data.referrer || ""
    };

    console.log("Final Lead:", lead);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch (error) {
    console.error("ERROR:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Something went wrong" })
    };
  }
};
