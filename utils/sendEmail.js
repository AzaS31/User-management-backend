const fs = require('fs');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
const TOKEN_PATH = 'token.json';
const CREDENTIALS_PATH = 'credentials.json'; 

async function getAuthenticatedClient() {
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
    const { client_secret, client_id, redirect_uris } = credentials.installed;

    const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
    );

    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
    oAuth2Client.setCredentials(token);

    return oAuth2Client;
}

function makeEmailBody(to, subject, html) {
    const messageParts = [
        `To: ${to}`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${subject}`,
        '',
        html,
    ];

    const message = messageParts.join('\n');
    const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    return encodedMessage;
}

async function sendEmail(to, subject, html) {
    try {
        const auth = await getAuthenticatedClient();
        const gmail = google.gmail({ version: 'v1', auth });

        const raw = makeEmailBody(to, subject, html);

        const result = await gmail.users.messages.send({
            userId: 'me',
            requestBody: { raw },
        });

        console.log('✅ Email sent successfully!');
        console.log('📨 Gmail API response:', result.data);
    } catch (error) {
        console.error('❌ Email sending failed:', error);
    }
}

module.exports = sendEmail;
