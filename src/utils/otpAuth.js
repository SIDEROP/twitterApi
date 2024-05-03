import speakeasy from "speakeasy";

// Function to generate OTP based on a secret
function generateOTP(secret) {
  return speakeasy.totp({
    secret: secret,
    encoding: "base32",
  });
}

// Function to verify OTP
function verifyOTP(secret, otp) {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: "base32",
    token: otp,
    window: 1, // Allow 1-step tolerance
  });
}

// Example usage
const userSecret = "mySecretKey"; // Replace this with user-entered secret

// Generate OTP
const otp = generateOTP(userSecret);
console.log("Generated OTP:", otp);

// Simulate user input (replace this with actual user input)
const userInputOTP = "123456"; // Example OTP entered by the user

// Verify OTP
const isVerified = verifyOTP(userSecret, userInputOTP);

if (isVerified) {
  console.log("OTP is valid");
} else {
  console.log("Invalid OTP");
}
