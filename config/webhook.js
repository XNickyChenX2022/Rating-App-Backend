const webhooks = async (type) => {
  try {
    const response = await fetch("https://api.igdb.com/v4/games/webhooks/", {
      method: "POST",
      headers: {
        Accept: "application/x-www-form-urlencoded",
        "Client-ID": process.env.CLIENT_ID,
        Authorization: "Bearer " + process.env.access_token,
      },
      body: new URLSearchParams({
        url: process.env.WEBHOOK_URL + `/api/webhooks/${type}`,
        secret: process.env.WEBHOOK_SECRET,
        method: type,
      }).toString(),
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

const registerWebhooks = async () => {
  if (process.env.access_token != null) {
    console.log("access token available");
    await webhooks("create");
    await webhooks("update");
    return;
  }
  console.log("waiting for access token initialization");
  if (process.env.access_token == null) {
    setTimeout(registerWebhooks, 1000);
  }
};

export default registerWebhooks;
