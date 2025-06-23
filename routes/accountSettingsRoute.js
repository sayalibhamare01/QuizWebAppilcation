const express = require("express");
const router = express.Router();
const { getAccountSettings, updateAccountSettings } = require("../controllers/accountSettingsController");

router.route("/").get(getAccountSettings).put(updateAccountSettings)

module.exports = router;
