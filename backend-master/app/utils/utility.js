const fs = require('fs').promises;
const path = require('path');
var generator = require("generate-password");

const adminRoleID = "62d5190befb00e5e7be49f3c";
const memberRoleID = "62d537874fe9ca41cade0dfe";
const businessRoleID = "62d537874fe9ca41cade0ddf";
const otpExpiryMinutes = 30

async function saveBase64Image(base64Image, filePath) {
    try {
      //const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
  
      const imageBuffer = Buffer.from(base64Image, 'base64');

        // Resolve the absolute file path
        const absolutePath = path.resolve(filePath);

        // Create the directory if it doesn't exist
        const dirname = path.dirname(absolutePath);
        await fs.mkdir(dirname, { recursive: true });
  
      await fs.writeFile(absolutePath, imageBuffer);
  
      console.log('Image saved successfully!');
    } catch (error) {
      console.error('Error saving image:', error);
    }
  }

  const generatePassword = (length) => {
    let OTP = generator.generate({
      length: length,
      numbers: true,
      lowercase: true,
      uppercase: true,
    });
  
    return OTP;
  };


module.exports = {memberRoleID,businessRoleID,otpExpiryMinutes,adminRoleID,saveBase64Image,generatePassword}