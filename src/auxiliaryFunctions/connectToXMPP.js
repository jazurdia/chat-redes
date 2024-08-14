// eslint-disable-next-line no-unused-vars
import { client as xmppClient, xml } from '@xmpp/client';

export const connectToXMPP = async (jid, password) => {
    const client = xmppClient({
        service: 'ws://alumchat.lol:7070/ws/', // HTTP links should be avoided in production
        domain: 'alumchat.lol',
        username: jid,
        password: password,
    });

    client.on('error', (err) => {
        console.error('XMPP Error:', err);
    });

    try {
        await client.start();
        return client;
    } catch (error) {
        console.error('Failed to connect:', error);
        throw error;
    }
};
