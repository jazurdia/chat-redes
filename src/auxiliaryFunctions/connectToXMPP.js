import {client as xmppClient, xml} from '@xmpp/client';

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

        // Send presence stanza to indicate the user is online with show and status
        const presenceStanza = xml('presence', {},
            xml('show', {}, 'chat'),
            xml('status', {}, 'ready to chat')
        );
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
                    let from = message.attrs.from;
                    const to = message.attrs.to; // Extraer el campo 'to'
                    const timestamp = forwarded.getChild('delay', 'urn:xmpp:delay').attrs.stamp;
                    const messageId = message.attrs.id;

                    // Normalize the 'from' attribute
                    from = from.split('@alumchat.lol')[0] + '@alumchat.lol';

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
            {type: 'set', id: 'get-messages'},
            xml('query', {xmlns: 'urn:xmpp:mam:2'})
        );

        /** nota:
         * query mamon regresa lo que pinches quiere
         * probe 50 formas diferentes, regresa los mismo 28 mensajes que saber como decide meter
         * porque no son ni los últimos, ni los primeros, ni los mas fáciles de encontrar por orden alfabético.
         * no entiendo como M pedir esto de manera ordenada.
         */


        client.send(mamRequestStanza);

        setTimeout(() => {
            client.removeListener('stanza', handleStanza); // Remove the event listener
            resolve(stanzas);
        }, 1000);
    });
};

export const listenForNewMessages = (client, callback) => {
    const handleStanza = (stanza) => {
        if (stanza.is('message') && stanza.attrs.type === 'chat') {
            const body = stanza.getChildText('body');
            let from = stanza.attrs.from;
            const to = stanza.attrs.to;
            const timestamp = new Date().toISOString(); // Use current timestamp for new messages

            // Normalize the 'from' attribute
            // esto es solo para los individuales.
            from = from.split('@alumchat.lol')[0] + '@alumchat.lol';

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

    // Return a function to remove the listener when needed
    return () => {
        client.removeListener('stanza', handleStanza);
    };
};

export const sendMessage = async (client, to, body) => {
    const from = client.jid.toString();

    console.log("Mensaje enviado:",from, to, body);

    const messageStanza = xml(
        'message',
        {type: 'chat', to, from},
        xml('body', {}, body)
    );

    try {
        await client.send(messageStanza);
        console.log('Message sent:', body, '\nto:', to);
    } catch (error) {
        console.error('Failed to send message:', error);
        throw error;
    }
};

export const registerUser = async (newUsername, newPassword) => {
    console.log("Registering new user...\nNew username: " + newUsername);

    // Crear cliente XMPP con las credenciales del usuario existente
    const client = xmppClient({
        service: 'ws://alumchat.lol:7070/ws/',
        domain: 'alumchat.lol',
        username: 'azu21242',
        password: 'azu21242',
    });

    client.on('error', (err) => {
        console.error('XMPP Error:', err);
    });

    try {
        // Iniciar el cliente XMPP
        await client.start();

        // Enviar el IQ request para registrar el nuevo usuario
        const registrationResponse = await client.iqCaller.request(
            xml(
                "iq",
                {type: "set"},
                xml(
                    "query",
                    {xmlns: "jabber:iq:register"},
                    xml("username", {}, newUsername),
                    xml("password", {}, newPassword)
                )
            )
        );

        console.log('Registration response:', registrationResponse);

        if (registrationResponse.attrs.type === 'result') {
            console.log('User registered successfully');
        } else {
            throw new Error('Registration failed');
        }

        // Cerrar sesión del nuevo usuario
        const newUserClient = xmppClient({
            service: 'ws://alumchat.lol:7070/ws/',
            domain: 'alumchat.lol',
            username: newUsername,
            password: newPassword,
        });

        newUserClient.on('error', (err) => {
            console.error('XMPP Error:', err);
        });

        await newUserClient.start();
        await newUserClient.stop();
        console.log('Logged out the new user');
    } catch (error) {
        console.error('Failed to register:', error);
        throw error;
    } finally {
        // Cerrar sesión del usuario existente
        await client.stop();
        console.log('Logged out the existing user');
    }
};

export const deleteAccount = async (client) => {
    try {
        // Enviar el IQ request para eliminar la cuenta del usuario
        const deleteResponse = await client.iqCaller.request(
            xml(
                "iq",
                {type: "set"},
                xml(
                    "query",
                    {xmlns: "jabber:iq:register"},
                    xml("remove")
                )
            )
        );

        console.log('Delete account response:', deleteResponse);

        if (deleteResponse.attrs.type === 'result') {
            console.log('User account deleted successfully');
        } else {
            throw new Error('Account deletion failed');
        }
    } catch (error) {
        console.error('Failed to delete account:', error);
        throw error;
    }
};


export const getContacts = async (client) => {
    try {
        // Enviar el IQ request para obtener la lista de contactos
        const rosterResponse = await client.iqCaller.request(
            xml(
                'iq',
                {type: 'get'},
                xml(
                    'query',
                    {xmlns: 'jabber:iq:roster'}
                )
            )
        );

        if (rosterResponse.attrs.type === 'result') {
            const contacts = [];
            const items = rosterResponse.getChild('query', 'jabber:iq:roster').getChildren('item');
            items.forEach(item => {
                let jid = item.attrs.jid;

                // Normalize the 'jid' attribute
                jid = jid.split('@alumchat.lol')[0] + '@alumchat.lol';

                contacts.push({
                    jid,
                    subscription: item.attrs.subscription || 'none'
                });
            });
            return contacts;
        } else {
            throw new Error('Failed to retrieve contacts');
        }
    } catch (error) {
        console.error('Failed to get contacts:', error);
        throw error;
    }
};

export const listenForStatusChanges = (client, callback) => {
    const handleStanza = (stanza) => {
        if (stanza.is('presence')) {
            const status = stanza.getChildText('status');
            const show = stanza.getChildText('show');
            let from = stanza.attrs.from;

            // Normalize the 'from' attribute
            from = from.split('@alumchat.lol')[0] + '@alumchat.lol';

            if (status || show) {
                callback({
                    from,
                    status,
                    show,
                });
            }

            console.log('Received presence:', '\nfrom:', from, '\nstatus:', status, '\nshow:', show);
        }
    };

    client.on('stanza', handleStanza);

    // Return a function to remove the listener when needed
    return () => {
        client.removeListener('stanza', handleStanza);
    };
}

export const addContact = async (client, jid) => {
    try {
        // Enviar el IQ request para añadir un nuevo contacto
        const addContactResponse = await client.iqCaller.request(
            xml(
                'iq',
                {type: 'set'},
                xml(
                    'query',
                    {xmlns: 'jabber:iq:roster'},
                    xml('item', {jid})
                )
            )
        );

        console.log('Add contact response:', addContactResponse);

        if (addContactResponse.attrs.type === 'result') {
            console.log('Contact added successfully');
        } else {
            throw new Error('Failed to add contact');
        }
    } catch (error) {
        console.error('Failed to add contact:', error);
        throw error;
    }
};