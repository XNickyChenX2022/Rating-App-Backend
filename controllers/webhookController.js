import asyncHandler from "express-async-handler";

const registerWebhook = asyncHandler(async (req, res) => {
  try {
    const response = await fetch("https://api.igdb.com/v4/games/webhooks/", {
      method: "POST",
      headers: {
        Accept: "application/x-www-form-urlencoded",
        "Client-ID": process.env.CLIENT_ID,
        Authorization: "Bearer " + process.env.access_token,
      },
      body: new URLSearchParams({
        url: process.env.WEBHOOK_URL + "/api/webhooks/create",
        secret: process.env.WEBHOOK_SECRET,
        method: "create",
      }).toString(),
    });
    const data = await response.json();
    // console.log(data);
    res.status(200).send(data);
  } catch (error) {
    res.status(400);
    throw new Error("unable to register webhook");
  }
});

const createGames = asyncHandler(async (req, res) => {
  const data = req.body;
  //     console.log(data);
  //   console.log("working");
  res.status(200).send("OK");
});

export { registerWebhook, createGames };
