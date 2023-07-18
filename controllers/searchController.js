import asyncHandler from "express-async-handler";

// @desc    Get data from IGDB API
// @route   POST /api/search
// @method  public
const searchGames = asyncHandler(async (req, res) => {
  const { search } = req.body;
  try {
    const response = await fetch(`https://api.igdb.com/v4/games`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": process.env.CLIENT_ID,
        Authorization: "Bearer " + process.env.access_token,
      },
      body: `fields name, cover.image_id, platforms.name, category, remakes.name, remasters.name, dlcs.name, expansions.name, involved_companies.company.name; where category = (0) & version_parent = null & name ~"${search}"* & cover.image_id != null; `,
    });
    const games = await response.json();
    res.status(200).json(games);
  } catch (error) {
    res.status(400);
    throw new Error("unable to retrieve data");
  }
});

export { searchGames };
