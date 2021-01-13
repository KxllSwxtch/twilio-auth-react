const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { stat } = require("fs");
require("dotenv").config({ debug: true });

// ENV variables
const port = process.env.PORT || 4000;
const twilioAccountSID = process.env.TWILIO_ACCOUNT_SID;
const twilioAccountAuthToken = process.env.TWILIO_ACCOUNT_AUTH_TOKEN;
const twilioServiceSID = process.env.TWILIO_SERVICE_SID;

// Twilio setup
const twilioClient = require("twilio")(
  twilioAccountSID,
  twilioAccountAuthToken,
);

// Create an express application
const app = express();

// CORS options
const whitelist = ["http://localhost:3000"];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
};

// Express server integrations
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "build")));
app.use(cors(corsOptions));

app.post("/signup", (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  twilioClient.verify
    .services(twilioServiceSID)
    .verifications.create({ to: phoneNumber, channel: "sms" })
    .then((verification) => res.send(verification));
});

app.post("/verify", (req, res) => {
  const { smsCode, phoneNumber } = req.body;
  twilioClient.verify
    .services(twilioServiceSID)
    .verificationChecks.create({ to: phoneNumber, code: smsCode })
    .then((data) => res.send(data.valid));
});

app.listen(port, () => console.log(`The server is running on port: ${port}`));
