require('dotenv').config();
const readline = require('readline-sync');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const APIKey = require('./models/APIkey');
const fs = require('fs');
const path = require('path');
const sendMail= require('./mailer')
async function main() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const logPath = path.join(__dirname, 'logs/audit.log');
  fs.mkdirSync(path.dirname(logPath), { recursive: true });

  function logAction(action, key) {
    const line = `[${new Date().toISOString()}] ${action} - ${key}\n`;
    fs.appendFileSync(logPath, line);
  }

  while (true) {
    console.log("\n API Key Management CLI");
    console.log("1. Generate API key");
    console.log("2. Verify API key");
    console.log("3. Revoke API key");
    console.log("4. List API keys for user");
    console.log("0. Exit");
    const choice = readline.questionInt("Choose an option: ");

    switch (choice) {
      case 1:
        const user = readline.question("Enter user email or name: ");
        const role = readline.question("Role (user/admin)? ", { defaultInput: "user" });
        const key = uuidv4();
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); 
        const apiKey = new APIKey({ key, user, expiresAt, role });
        
        await apiKey.save();
       logAction('ISSUE', key);
       await sendMail(user, 'Your API Key', `Here is your API key:\n\n${key}`);
      console.log("API Key generated and emailed:", key);
        break;

      case 2:
        const verifyKey = readline.question("Enter API key to verify: ");
        const found = await APIKey.findOne({ key: verifyKey, isActive: true });
        if (!found || found.expiresAt < Date.now()) {
          logAction('FAILED_VERIFY', verifyKey);
          console.log(" Invalid or expired API key.");
        } else {
          logAction('VERIFY', verifyKey);
          console.log(" Valid key for user:", found.user);
        }
        break;

      case 3:
        const revokeKey = readline.question("Enter API key to revoke: ");
        const revoked = await APIKey.findOneAndUpdate(
          { key: revokeKey },
          { isActive: false, revokedAt: new Date() },
          { new: true }
        );
        if (!revoked) {
          console.log("Key not found.");
        } else {
          logAction('REVOKE', revokeKey);
          await sendMail(revoked.user, 'API Key Revoked', `Your API key has been revoked:\n\n${revokeKey}`);
  console.log(" Key revoked and user notified.");
        
        }
        break;

      case 4:
        const listUser = readline.question("Enter user email or name: ");
        const keys = await APIKey.find({ user: listUser });
        if (keys.length === 0) {
          console.log("No keys found for this user.");
        } else {
          console.log("API Keys:");
          keys.forEach(k => {
            console.log(` ${k.key} | Active: ${k.isActive} | Exp: ${k.expiresAt?.toISOString()} | Role: ${k.role}`);
          });
        }
        break;

      case 0:
        console.log(" Exiting CLI...");
        await mongoose.disconnect();
        process.exit(0);
        break;

      default:
        console.log(" Invalid choice. Try again.");
    }
  }
}

main();
