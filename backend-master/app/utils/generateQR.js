const QRCode = require('qrcode');
const { Jimp } = require("jimp");
const moment = require("moment")

async function generateQRCodeWithLogo(id,name,type) {
  try {
    const qrText = 'https://example.com'; // Text or URL for the QR code
    const qrCodePath = `./public/qrs/${moment().unix()}_${type}_${name}.png`; // Path to save the QR code
    const logoPath = './logo.png'; // Path to your logo file
    const finalQRCodePath = `media/qrs/${moment().unix()}_${type}_${name}.png`; // Path to save the final QR code with logo

    // Generate QR code
    const qrCodeOptions = {
      errorCorrectionLevel: 'H', // High error correction level to accommodate the logo
      color: {
        dark: '#08A9F3', // Blue color for the QR code
        light: '#FFFFFF', // White background
      },
      scale: 20
    };
    await QRCode.toFile(qrCodePath, qrText, qrCodeOptions);

    // // Load QR code and logo
    // const qrCodeImage = await Jimp.read(qrCodePath);
    // const logoImage = await Jimp.read(logoPath);

    // // Resize the logo to fit the center of the QR code
    // const qrWidth = qrCodeImage.bitmap.width;
    // const logoWidth = qrWidth * 0.2; // Logo size is 20% of the QR code's width


    // // Composite the logo onto the QR code
    // const x = (qrWidth - logoWidth) / 2;
    // const y = (qrWidth - logoWidth) / 2;
    // qrCodeImage.composite(logoImage, x, y, {
    //   mode: Jimp.BLEND_SOURCE_OVER,
    //   opacitySource: 1,
    // });

    // // Save the final QR code with the logo
    // await qrCodeImage.write(finalQRCodePath); // save
    return finalQRCodePath

    console.log(`QR Code with logo generated at: ${finalQRCodePath}`);
  } catch (error) {
    console.error('Error generating QR code with logo:', error);
  }
}

module.exports = {generateQRCodeWithLogo}