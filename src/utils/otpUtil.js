const credentials = {apiKey: process.env.AFRICAS_TALKING_API_KEY, username: process.env.AFRICAS_TALKING_USERNAME,};
const sms = require('africastalking')(credentials);
const logger = require('../logger');

function GenerateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit number
    return otp.toString();
  }

async function SendOTP(phoneNumber, otp) {
  const options = {
    to: [phoneNumber],
    message: `Your OTP is: ${otp}`,
  };

  try {
    const response = await sms.SMS.send(options);
    logger.info({response})
    if (response.SMSMessageData.Recipients[0].statusCode == 101){
      return true;
    }
    return false
  } catch (error) {
      logger.error(`Error sending OTP to phone number: ${phoneNumber}`)
      throw error;
  }
}

  module.exports = {
    GenerateOTP,
    SendOTP
  }