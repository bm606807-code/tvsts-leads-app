let leads = [];

exports.handler = async (event) => {
  if (event.httpMethod === "POST") {
    const body = JSON.parse(event.body);

    leads.push({
      ...body,
      created_at: new Date().toISOString()
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  }

  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      body: JSON.stringify(leads)
    };
  }
};
