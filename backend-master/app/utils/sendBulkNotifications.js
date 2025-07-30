const { firebase } = require('../config/firebase');

const sendBulkNotification = async (title, body, data, tokens) => {
  try {
    // Constructing messages array
    const messages = tokens.map((token) => ({
      notification: {
        title: title,
        body: body,
      },
      android: {
        notification: {
          channelId: 'vakeel',
          priority: 'high'
        }
      },
      token: token, // Assuming tokens is an array of strings
      data: { obj: JSON.stringify(data) },
    }));

    if (messages.length > 0) {
      // Sending all messages at once
      const response = await firebase.messaging().sendAll(messages);

      console.log('Successfully sent messages:', response.responses);

      response.responses.forEach((result, index) => {
        if (!result.success) {
          console.error('Failed to send message:', result.error);
        }
      });
    }
  } catch (error) {
    console.error('Error sending messages:', error);
  }
};

module.exports = sendBulkNotification;

