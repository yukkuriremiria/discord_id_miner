const axios = require('axios');
const fs = require('fs');
const path = require('path');
//汚いコードで申し訳ねぇ

// config.jsonをload
const rawConfig = fs.readFileSync('config.json');
const config = JSON.parse(rawConfig);

// 設定取得
const token = config.token;
const interval = config.interval;
const idcount = config.idcount;

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_.';

const url = "https://discord.com/api/v9/users/@me/pomelo-attempt";
const headers = {
    "accept": "*/*",
    "accept-language": "ja,en-US;q=0.9,en;q=0.8",
    "authorization": token,
    "content-type": "application/json",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Google Chrome\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-debug-options": "bugReporterEnabled",
    "x-discord-locale": "ja",
    "x-discord-timezone": "Asia/Tokyo",
    "x-super-properties": "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwic3lzdGVtX2xvY2FsZSI6ImphIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZyBHZWNrbykgQ2hyb21lLzEyNS4wLjAuMCBTYWZhcmkvNTM3LjM2IiwiYnJvd3Nlcl92ZXJzaW9uIjoiMTI1LjAuMC4wIiwib3NfdmVyc2lvbiI6IjEwIiwicmVmZXIiOiIiLCJyZWZlcnJpbmdfZG9tYWluIjoiIiwicmVmZXJyZXJfY3VycmVudCI6IiIsInJlZmVycmVyX2RvbWFpbl9jdXJyZW50IjoiIiwicmVsZWFzZV9jaGFubmVsIjoic3RhYmxlIiwiY2xpZW50X2J1aWxkX251bWJlciI6Mjk2MjA0LCJjbGllbnRfZXZlbnRfc291cmNlIjpudWxsLCJkZXNpZ25faWQiOjB9",
    "Referer": "https://discord.com/channels/@me",
    "Referrer-Policy": "strict-origin-when-cross-origin"
};

const getRandomUsername = () => {
    let username = '';
    for (let i = 0; i < idcount; i++) {
        username += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return username;
};

const checkUsername = async () => {
    const username = getRandomUsername();

    try {
        const response = await axios.post(url, {
            username
        }, { headers });

        if (response.data.taken === false) {
            console.log(`${username} is not taken.`);
            const logFile = path.join(__dirname, 'username_not_taken.json');
            fs.appendFileSync(logFile, JSON.stringify({ username }) + '\n');
        } else {
            console.log(`${username} is taken.`);
            const logFile = path.join(__dirname, 'username_taken.json');
            fs.appendFileSync(logFile, JSON.stringify({ username }) + '\n');
        }
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
};
console.log(` **************************** \n *Discord ID Miner By Kazume* \n **************************** \n`)

axios.get('https://discord.com/api/v9/users/@me', {
  headers: {
    authorization: token
  }
})
  .then(response => {
    console.log('ACC-INFO', response.data, '\n');
  })
  .catch(error => {
    console.error('Login Error. \n');
  });

setInterval(checkUsername, interval);
