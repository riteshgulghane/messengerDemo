/**
 * Copyright 2021-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Messenger For Original Coast Clothing
 * https://developers.facebook.com/docs/messenger-platform/getting-started/sample-apps/original-coast-clothing
 */
// require('dotenv').config();
"use strict";

// Import dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json());



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const request = require('request');
const connectDB = require('./src/configs/db');
const { addUserData } = require("./src/services/UserDataService");
const { checkUser, updateUser, addUser } = require("./src/services/UserService");
const cors = require('cors');

connectDB();

// Serving static files in Express

// Set template engine in Express

let greetings = [
  'hi',
  'Hi',
  'hI',
  'HI'
]

let dobFormat = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

app.use('/userData', require('./src/controllers/UserDataController'));

app.use('/users', require('./src/controllers/UserController'));

app.use('/messages', require('./src/controllers/MessageController'));

app.use(cors({ origin: "*" }));

const userData = require('./src/models/UserData');
const users = require('./src/models/User');

app.get('/summary', (req, res) => {
  userData.aggregate(
    [
      {
        $lookup: {
          from: "users", // collection to join
          localField: "sender_psid",//field from the input documents
          foreignField: "sender_psid",//field from the documents of the "from" collection
          as: "Data"// output array field
        }
      },
      {
        $group:
        {
          _id: "$sender_psid",
          messages: {
            $push: "$message"
          },
          username: {
            $first: "$Data.firstname"
          }
        }
      },
      {
        $project:
        {
          _id: 0,
          user_id: "$_id",
          messages: 1,
          username: 1
        }
      }

    ], function (error, data) {
      data.map(ele => {
        return ele.username = ele.username[0];
      });
      return res.json(data);
    });
});

app.set("view engine", "ejs");

// Respond with index file when a GET request is made to the homepage
app.get("/", function (_req, res) {
  res.render("index");
});

function getNumOfDays(dateOfBirth) {
  let dob = new Date(dateOfBirth);
  let date = (dob.getDate());
  let month = (dob.getMonth());

  let today = new Date();
  let todayDate = (today.getDate());
  let todayMonth = (today.getMonth());
  let todayYear = (today.getFullYear());

  if (todayDate == date && todayMonth == month) {
    return "Happy Birtday..!!";
  }
  else {
    let nextYear = month > todayMonth ? 0 : ((month == todayMonth) && date > todayDate) ? 0 : 1;
    let nextBirthday = new Date((todayYear + nextYear), month, date + 1);
    let oneDay = 1000 * 60 * 60 * 24;
    let diff = ((nextBirthday - today) / oneDay).toFixed();
    return `There are ${diff} days left until your next birthday`;
  }
}

// Add support for GET requests to our webhook
app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = process.env.PAGE_ACCESS_TOKEN;

  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {

    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);

    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

// Create the endpoint for your webhook
app.post('/webhook', (req, res) => {

  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function (entry) {

      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      if (webhook_event.message.text)
        console.log('Sender PSID: ' + sender_psid);
      if (webhook_event.message.text) {
        if (!webhook_event.message.is_echo) {
          let userData = {
            message: webhook_event.message.text,
            sender_psid: sender_psid
          }
          // addUserData(userData);
        }
      }

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });
    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});


// Handles messages events
async function handleMessage(sender_psid, received_message) {

  let response;

  // Check if the message contains text
  if (received_message.text) {
    let user = await checkUser(sender_psid)
    if (user) {
      if (!user.basicDeatils) {
        if (user.firstname) {
          if (user.dob) {
            if (["yes", "yeah", "yup", "Yes", "Yeah", "Yup"].includes(received_message.text)) {
              user.basicDeatils = true;
              user = await updateUser(sender_psid, user);
              response = {
                "text": getNumOfDays(new Date(user.dob))
              }
            } else if (["no", "nah", "No", "Nah"].includes(received_message.text)) {
              user.basicDeatils = true;
              user = await updateUser(sender_psid, user);
              response = {
                "text": `Goodbye 👋`
              }
            }
            else {
              response = {
                "text": `Do you wants to know how many days till next birthday? if yes then reply 'yes' else 'no'`
              }
            }
          } else {
            if (dobFormat.test(received_message.text)) {
              user.dob = received_message.text;
              user = await updateUser(sender_psid, user);
              response = {
                "text": `Do you wants to know how many days till next birthday?`
              }
            }
            else {
              response = {
                "text": `please tell us your date of birth in the format of YYYY-MM-DD`
              }
            }
          }
        } else {
          user.firstname = received_message.text;
          user = await updateUser(sender_psid, user);
          response = {
            "text": `please tell us your date of birth in the format of YYYY-MM-DD`
          }
        }
      } else {
        let msgBody = {
          sender_psid: sender_psid,
          message: received_message.text
        }
        await addUserData(msgBody);
        response = {
          "text": `you entered - ${received_message.text}`
        }
      }
    }
    else if (greetings.includes(received_message.text)) {
      addUser({
        sender_psid: sender_psid
      });
      response = {
        "text": `please tell us your good name.`
      }
    }
    else {
      response = {
        "text": `please say hi to start the conversation. Thank you!`
      }
    }
  }

  // Sends the response message
  callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
  // let response;

  // // Get the payload for the postback
  // let payload = received_postback.payload;

  // // Set the response based on the postback payload
  // if (payload === 'yes') {
  //   response = { "text": "Thanks!" }
  // } else if (payload === 'no') {
  //   response = { "text": "Oops, try sending another image." }
  // }
  // // Send the message to acknowledge the postback
  // callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  });
}



// Check if all environment variables are set

// Listen for requests :)
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));


