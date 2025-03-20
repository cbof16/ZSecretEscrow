const zcash = require('zcash');

console.log("Verifying zcash installation...");
console.log("Zcash up");

// Basic check to verify the module is properly loaded
if (zcash) {
  console.log("Zcash module successfully imported");
} else {
  console.error("Failed to load zcash module");
}
