import SibApiV3Sdk from "sib-api-v3-sdk";

const sendOTPEmail = async (toEmail, otp) => {
  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    // 🔥 MANUALLY SET API KEY
    SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
      process.env.BREVO_API_KEY;

    await apiInstance.sendTransacEmail({
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: "Account App"
      },
      to: [{ email: toEmail }],
      subject: "Your OTP Code",
      htmlContent: `<h3>Your OTP is: ${otp}</h3>`
    });

  } catch (error) {
    console.error("FULL ERROR:", error.response?.body || error.message);
    throw new Error("Failed to send email");
  }
};

export default sendOTPEmail;