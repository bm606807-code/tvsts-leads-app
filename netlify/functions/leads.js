exports.handler = async (event) => {
  try {
    // Handle empty body (GET request from browser)
    if (!event.body) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "API is working" })
      };
    }

    // Parse actual POST data
    const data = JSON.parse(event.body);

    console.log("Lead received:", data);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Lead received successfully" })
    };

  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Something went wrong" })
    };
  }
};