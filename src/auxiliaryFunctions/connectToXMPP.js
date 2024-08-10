import {client as xmppClient} from '@xmpp/client';

export const connectToXMPP = async (jid, password) => {
    const client = xmppClient({
        service: 'ws://alumchat.lol:7070/ws/',
        domain: 'alumchat.lol',
        username: jid,
        password: password,
    });

    client.on('error', (err) => {
        console.error('XMPP Error:', err);
    });

    client.on('online', (address) => {
        console.log('Connected as', address.toString());
    });

    client.on('stanza', (stanza) => {
        console.log('New stanza:', stanza.toString());
    });

    try {
        await client.start();
        console.log('Connection started successfully');
        return client;
    } catch (error) {
        console.error('Failed to connect:', error);
        throw error;
    }
};
