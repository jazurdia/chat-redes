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

        // Send presence stanza to indicate the user is online
        const presenceStanza = xml('presence');
        client.send(presenceStanza);

        return client;
    } catch (error) {
        console.error('Failed to connect:', error);
        throw error;
    }
};


export const getMessages = async (client) => {
    return new Promise((resolve) => {
        const stanzas = [];
        const processedMessageIds = new Set();

        const handleStanza = (stanza) => {
            if (stanza.is('message') && stanza.getChild('result', 'urn:xmpp:mam:2')) {
                const result = stanza.getChild('result', 'urn:xmpp:mam:2');
                const forwarded = result.getChild('forwarded', 'urn:xmpp:forward:0');
                if (forwarded) {
                    const message = forwarded.getChild('message', 'jabber:client');
                    const body = message.getChildText('body');
                    const from = message.attrs.from;
                    const to = message.attrs.to; // Extraer el campo 'to'
                    const timestamp = forwarded.getChild('delay', 'urn:xmpp:delay').attrs.stamp;
                    const messageId = message.attrs.id;

                    if (!processedMessageIds.has(messageId)) {
                        processedMessageIds.add(messageId);
                        stanzas.push({
                            from,
                            to, // Incluir el campo 'to'
                            body,
                            timestamp,
                        });
                    }
                }
            }
        };

        client.on('stanza', handleStanza);

        // MAM query to retrieve all archived messages
        const mamRequestStanza = xml(
            'iq',
            { type: 'set', id: 'get-messages' },
            xml('query', { xmlns: 'urn:xmpp:mam:2' },
                xml('x', { xmlns: 'jabber:x:data', type: 'submit' },
                    xml('field', { var: 'FORM_TYPE', type: 'hidden' },
                        xml('value', {}, 'urn:xmpp:mam:2')
                    )
                )
            )
        );

        console.log('Sending MAM request stanza:\n', mamRequestStanza.toString());

        client.send(mamRequestStanza);

        setTimeout(() => {
            client.removeListener('stanza', handleStanza); // Remove the event listener
            resolve(stanzas);
        }, 5000);
    });
};

export const listenForNewMessages = (client, callback) => {
    const handleStanza = (stanza) => {
        if (stanza.is('message') && stanza.attrs.type === 'chat') {
            const body = stanza.getChildText('body');
            const from = stanza.attrs.from;
            const to = stanza.attrs.to;
            const timestamp = new Date().toISOString(); // Use current timestamp for new messages

            if (body) {
                callback({
                    from,
                    to,
                    body,
                    timestamp,
                });
            }

            console.log('Received message:', body, '\nfrom:', from, '\nto:', to);

        }
    };

    client.on('stanza', handleStanza);

    // Poll for new messages every 3 seconds
    const intervalId = setInterval(() => {
        client.send(xml('presence')); // Send a presence stanza to keep the connection alive
    }, 3000);

    // Return a function to remove the listener and clear the interval when needed
    return () => {
        client.removeListener('stanza', handleStanza);
        clearInterval(intervalId);
    };
};