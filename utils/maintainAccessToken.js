export default class maintainTokens {
  constructor(redisClient) {
    this.redisClient = redisClient;
    this.maintainToken();
    setInterval(() => {
      this.maintainToken();
    }, 10 * 60 * 1000);
  }

  async maintainToken() {
    let token = await this.redisClient.hGet(
      process.env.CLIENT_ID,
      "access_token"
    );
    if (token) {
      console.log("Verifying Credentials");
      try {
        process.env.access_token = token;
        const response = await fetch(`https://id.twitch.tv/oauth2/validate`, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + process.env.access_token,
          },
        });
        if (response.status != 200) {
          console.log("Invalid Token");
          this.createAccessToken();
          return;
        }
        const responseBody = await response.json();
        if (responseBody.expires_in < 3600) {
          this.createAccessToken();
          return;
        }
        console.log(`token verified, ${responseBody.expires_in} left`);
      } catch (error) {
        console.log(`Token Failed Verification: ${error}`);
        this.createAccessToken();
      }
    } else {
      console.log("No token exists");
      this.createAccessToken();
    }
  }
  async createAccessToken() {
    try {
      console.log("Attempting to Create Access Token");
      const response = await fetch(`https://id.twitch.tv/oauth2/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          grant_type: "client_credentials",
        }),
      });
      const data = await response.json();
      console.log(data);
      await this.redisClient.hSet(
        process.env.Client_ID,
        "access_token",
        data.access_token
      );
      process.env.access_token = data.access_token;
      console.log("access Token Created");
    } catch (error) {
      console.log(`Failed to create Access Token: ${error}`);
    }
  }
}
