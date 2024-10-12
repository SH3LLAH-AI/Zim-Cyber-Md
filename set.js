const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZ0ZqMXQwYzQvODZmZTdsZS9TUlRYeVpRTEJSamtRS1JvdmNySU5zUmNGVT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUjh0TWk4bThHd0VkeCtkM2JvQVZjczcvZ2N0NkNzTWY3bU5FL1A5VS9Raz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI2QmRiNHFnN2lZR2wwaC95UVh2U2IvSnRUSk12VkFSMEpWWFRhcXZwa1ZRPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJpYUdVcUJPM0g5ZnNYaFlhdHVvbDRYU1hCQU95UFoxUmVidlRJYkp4a0RvPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkdNNUdZZjRvbEFVR3V3MkJZUWU0TjM1NDVxeHpZdDdkUTl3TTNwTDhuR3c9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ii9mM2E5R092bUd0K0VHSVJRYm1SSVgwS2JZWWlJWGttOXJzeVZJOVVoUXc9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiU01Uc2hGZHgranZZOVkzcjVPQkRQQUJ6cXI0Rys0YUxIS0ZwM0Z4a25GQT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiVnp0Y2V2NzNvc3pjSzlIQ0NrOFdHRTE3ZnN0WlZkYkNwOG4rVlllQWtpYz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Im1SdUl0RnY4OVcyOEIxUm9OY0d3ZTJVcWtpelp1bko4dlp6dC9IYUhBYUg1ZmNVZ3FhSkMrb0gzYkFmUE9adzBqV2wxbU83TXRIQ0pUVzBVS1Q5NUF3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTQxLCJhZHZTZWNyZXRLZXkiOiJLZ2I0Wnp0L1hLVFhBeml0c1FDaDBVV25mYXNqNWRieVVGZ0lTa3hRVlZjPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJEcXNBenBpR1JTV0hieG4xdFctVTZRIiwicGhvbmVJZCI6ImQ0MDg1YmU1LTZkOTMtNGU0OC05MTVjLTMyYmJkOTUwM2U4YiIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI2VkFUY3RjUHYxdEhEOExqbzE2d0JMWS81UHc9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoic0lhSHFhM3lsdHpzeDBLNjR0TVRqaEJOYnZvPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IkYyQVlOM0pOIiwibWUiOnsiaWQiOiIyNjM3MzUwMTE2OTU6N0BzLndoYXRzYXBwLm5ldCIsIm5hbWUiOiLwnZCZyarhtI0g8J2QgsqPypnhtIfKgHMgIEHKn8qfVOG0h+G0hMqcIn0sImFjY291bnQiOnsiZGV0YWlscyI6IkNJYkNpL1FERUtXdHFMZ0dHQVVnQUNnQSIsImFjY291bnRTaWduYXR1cmVLZXkiOiJlNU5uU3BKZndhL05VRFdkYzA5RjBvT3huekF2WEs5RWFHNXgrbDdqNG1ZPSIsImFjY291bnRTaWduYXR1cmUiOiJsSWxvMnM2ckRzTU85MnFqUXhPWHFKQjlEbEV5RFdSWnFmSm1FalNiT0dGRU01Z0VaUkxheDF3REtneDZwTkN5a2JOMHFzSmkwSXZScnZQN1YwanVDdz09IiwiZGV2aWNlU2lnbmF0dXJlIjoiVjF4Z2pDRU5teVVzY0g5ZEpUS2FiSWV2eEl5T3VGdVZrTDh5UXFMUEZ4VlFWaGQ1UHBZSGZjMjFHZTJHK1NvWmlkczVveThrL2JWdDJHcnRuR1N4RHc9PSJ9LCJzaWduYWxJZGVudGl0aWVzIjpbeyJpZGVudGlmaWVyIjp7Im5hbWUiOiIyNjM3MzUwMTE2OTU6N0BzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJYdVRaMHFTWDhHdnpWQTFuWE5QUmRLRHNaOHdMMXl2UkdodWNmcGU0K0ptIn19XSwicGxhdGZvcm0iOiJzbWJhIiwibGFzdEFjY291bnRTeW5jVGltZXN0YW1wIjoxNzI4NzE0NDE5LCJteUFwcFN0YXRlS2V5SWQiOiJBQUFBQUVNLyJ9 ',
    PREFIXE: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "David Cyril",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "234......",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "non",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'non',
    BOT : process.env.BOT_NAME || 'Gojou-MD',
    URL : process.env.BOT_MENU_LINKS || 'https://endpoint.web.id/server/file/6UV86kFhfC5MpFRa.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    //GPT : process.env.OPENAI_API_KEY || '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',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'no',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9" : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9",
    /* new Sequelize({
     dialect: 'sqlite',
     storage: DATABASE_URL,
     logging: false,
})
: new Sequelize(DATABASE_URL, {
     dialect: 'postgres',
     ssl: true,
     protocol: 'postgres',
     dialectOptions: {
         native: true,
         ssl: { require: true, rejectUnauthorized: false },
     },
     logging: false,
}),*/
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
