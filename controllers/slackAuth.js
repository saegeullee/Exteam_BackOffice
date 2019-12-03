const Axios = require("axios");

exports.slackAuth = async (req, res) => {
  const response = await Axios.get(
    "https://slack.com/api/oauth.access?client_id=CLIENT_ID&client_secret=CLIENT_SECRET&code=XXYYZZ"
  );
  console.log(response);
  res.end();
};
