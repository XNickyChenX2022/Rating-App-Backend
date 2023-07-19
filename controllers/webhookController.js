import asyncHandler from "express-async-handler";

const registerWebhook = asyncHandler(async (req, res) => {
  const response = fetch(`https://api.igdb.com/v4/ENDPOINT/webhooks/`, {
    method: "POST",
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Client-ID": process.env.CLIENT_ID,
      Authorization: "Bearer " + process.env.access_token,
    },
    body: new URLSearchParams({
      url: process.env.WEBHOOK_URL + "/create",
      secret: process.env.WEBHOOK_SECRET,
      method: "create",
    }),
  });
  const data = await response.json();
  console.log(data);
  res.status(200).send("registered Webhook");
});

const createGames = asyncHandler(async (req, res) => {
  const data = request.body;
  console.log(data);
  console.log("working");
  res.status(200).send("working");
});

export { registerWebhook, createGames };
