import { client, xml } from "@xmpp/client";
import debug from "@xmpp/debug";

const xmpp = client({
    service: 'ws://alumchat.lol:7070/ws/',
    domain: 'alumchat.lol',
    username: jid,
    password: password,
});

debug(xmpp, true);

xmpp.on('error', err => {
    console.error('❌', err.toString());
});

xmpp.on('offline', () => {
    console.log('⏹', 'offline');
});

xmpp.on('stanza', async stanza => {
    if (stanza.is("message")) {
        await xmpp.send(xml("presence", { type: "unavailable" }));
        await xmpp.stop();
    }
})

xmpp.on('online', async (address) => {
    // Makes the client available
    await xmpp.send(xml("presence"));

    // Send a message to itself
    const message = xml(
        "message",
        {type: "chat", to: jid},
        xml("body", {}, "Hello, world!")
    );
    await xmpp.send(message);
});

xmpp.start().catch(console.error);


















/*

}  else if (stanza.is('message') && stanza.getChild('result', 'urn:xmpp:mam:2') && stanza.getChild('result', 'urn:xmpp:mam:2').attrs.queryid === 'mam_query_1') {
    const result = stanza.getChild('result', 'urn:xmpp:mam:2');
    const forwarded = result.getChild('forwarded', 'urn:xmpp:forward:0');
    if (forwarded) {
        const message = forwarded.getChild('message', 'jabber:client');
        const body = message.getChild('body').text();
        const from = message.attrs.from;
        const to = message.attrs.to;
        console.log('📩 Archived message from', from, ':', body);
        const fromJid = from.split('/')[0];
        const toJid = to.split('/')[0];
        const timestamp = forwarded.getChild('delay', 'urn:xmpp:delay').attrs.stamp;
        if (fromJid.includes(this.xmpp.options.username)) {
            this.conversations[toJid] = this.conversations[toJid] ? [...this.conversations[toJid],  { sender: fromJid, message: body, timestamp }] : [ { sender: fromJid, message: body, timestamp }];
            this.emit('messageReceived', this.conversations);
        } else if (toJid.includes(this.xmpp.options.username)) {
            this.conversations[fromJid] = this.conversations[fromJid] ? [...this.conversations[fromJid], { sender: fromJid, message: body , timestamp}] : [{ sender: fromJid, message: body, timestamp }];
            this.emit('messageReceived', this.conversations);
        }
        console.log('📩 Conversations:', this.conversations);
    }
}


}  else if (stanza.is('message') && stanza.getChild('result', 'urn:xmpp:mam:2') && stanza.getChild('result', 'urn:xmpp:mam:2').attrs.queryid === 'mam_query_1') {


    const getHistory = async () => {
        if (xmppClient) {
            try {
                for (const contact of contacts) {
                    console.log("Retrieving history for:", contact.jid);
                    const queryId = "mam_query_1";
                    const mamQuery = xml(
                        "iq",
                        { type: "set", id: queryId },
                        xml(
                            "query",
                            { xmlns: "urn:xmpp:mam:2", queryid: queryId },
                            xml(
                                "x",
                                { xmlns: "jabber:x:data", type: "submit" },
                                xml(
                                    "field",
                                    { var: "FORM_TYPE", type: "hidden" },
                                    xml("value", {}, "urn:xmpp:mam:2")
                                ),
                                xml("field", { var: "with" }, xml("value", {}, contact.jid))
                            ),
                            xml(
                                "set",
                                { xmlns: "http://jabber.org/protocol/rsm" },
                                xml("max", {}, "10")
                            )
                        )
                    );
                    await xmppClient.iqCaller.request(mamQuery);
                }
            } catch (err) {
                console.error("Failed to retrieve history:", err);
            }
        }
    };


 */