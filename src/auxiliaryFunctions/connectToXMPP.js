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

/*
export const getMessages = async (client) => {
    return new Promise((resolve, reject) => {
        const stanzas = [];

        client.on('stanza', (stanza) => {
            //console.log('stanza:\n', stanza.toString()); // Log the entire stanza
            stanzas.push(stanza.toString());
        });

        // Send a MAM query to retrieve all archived messages
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

        console.log('Sending MAM request stanza:\n', mamRequestStanza.toString()); // Log the MAM request stanza
        client.send(mamRequestStanza);

        // Resolve after a delay to collect stanzas
        setTimeout(() => resolve(stanzas), 5000);
    });
};

 */

export const getMessages = async (client) => {
    return new Promise((resolve) => {
        const stanzas = [];

        client.on('stanza', (stanza) => {
           //console.log('stanza received:\n', stanza.toString()); // Log the entire stanza

            if (stanza.is('message') && stanza.getChild('result', 'urn:xmpp:mam:2')) {
                const result = stanza.getChild('result', 'urn:xmpp:mam:2');
                const forwarded = result.getChild('forwarded', 'urn:xmpp:forward:0');
                if (forwarded) {
                    const message = forwarded.getChild('message', 'jabber:client');
                    const body = message.getChildText('body');
                    const from = message.attrs.from;
                    const timestamp = forwarded.getChild('delay', 'urn:xmpp:delay').attrs.stamp;

                    stanzas.push({
                        from,
                        body,
                        timestamp,
                    });
                }
            }
        });

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
            resolve(stanzas);
        }, 5000);
    });
};