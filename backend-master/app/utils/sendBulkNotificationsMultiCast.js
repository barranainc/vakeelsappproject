// const { firebase } = require("../config/firebase");

// const sendBulkNotification = async (title, body, data, tokens) => {
//   try {
//     const messages = tokens.map((element) => ({
//       notification: {
//         title: title,
//         body: body,
//       },
//       android: {
//         notification: {
//           channelId: "fanoos",
//           priority: "high"
//         }
//       },
//       token: element.token,
//       data: { obj: JSON.stringify(data) },
//     }));

//     if (messages.length > 0) {
//       const response = await firebase.messaging().sendEach(messages);

//     console.log('Successfully sent messages:', response.responses);

//     response.responses.forEach((result, index) => {
//       if (!result.success) {
//         console.error(result);
//       }
//     });
//     }
    
//   } catch (error) {
//     console.error('Error sending messages:', error);
//   }
// };
// module.exports = sendBulkNotification;






const { firebase } = require('../config/firebase');

const sendBulkNotificationMulti = async (title, body, data, tokens) => {
  try {
    // Constructing messages array
    const tokensWithValues = tokens

  if (tokensWithValues.length > 0) {
    const message = {
      notification: {
        title: title,
        body: body,
      },
      android: {
        notification: {
          channelId: 'fanoos',
          priority: 'high',
        },
      },
      tokens: tokensWithValues, // Provide array of tokens here
      data: { obj: JSON.stringify(data) },
    };

    // Sending all messages at once as a MulticastMessage
    const response = await firebase.messaging().sendEachForMulticast(message);

    console.log('Successfully sent messages:', response.responses);

  }
  

    // if (messages.length > 0) {
    //   // Sending all messages at once
    //   const response = await firebase.messaging().sendEachForMulticast(messages);

    
    // }
  } catch (error) {
    console.error('Error sending messages:', error);
  }
};

module.exports = sendBulkNotificationMulti;

