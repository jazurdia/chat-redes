# XMPP Client
*Universidad del Valle de Guatemala, Agosto de 2024* <br>
*Redes de Computadoras CC3067* <br>
*Done by: Alejandro Azurdia*

## Description
The XMPP client is an instant messaging application developed in React that allows users to connect to an XMPP server, send and receive messages, manage contacts, and change their presence status. It uses the @xmpp/client library for communication with the XMPP server and is configured to work with the alumchat.lol server. The user interface is designed with Tailwind CSS and supports conversation viewing, file sending, and notification management.

---
## Screenshots

![img_2.png](imgs/img_2.png)
![img_4.png](imgs/img_4.png)
![img_1.png](imgs/img_1.png)
![img_5.png](imgs/img_5.png)
---
## Implemented Features
- [x] **Register a new account on the server**
- [x] **Log in with an existing account**
- [x] **Log out of an account**
- [x] **Delete an account from the server**
- [x] **Display all contacts and their status**
- [x] **Add a user to the contact list**
- [x] **View contact details**
- [x] **One-on-one communication with any user/contact**
- [ ] **Participate in group conversations**
- [x] **Set presence message**
- [x] **Send/receive notifications**
- [x] **Send/receive files**


## Installation and Running

**Prerequisites**
- Node.js (version 14.x or higher)
- npm (version 6.x or higher)

**Installation**
1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/xmpp-client.git
    cd xmpp-client
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

**Running the Application**
1. Start the development server:
    ```sh
    npm run dev
    ```

2. Open your browser and navigate to:
    ```
    http://localhost:5137
    ```

**Additional Configuration**
- Ensure you have the correct configuration for the XMPP server in the environment variables or configuration files as required by the `@xmpp/client` library.


## Challenges
The greatest challenge of this project was, undoubtedly, the use of the XMPP protocol. I had never used this protocol before and had no frame of reference. The documentation on XMPP as such was not very helpful to me, as each server seems to be configured and built however the author wished.

In this case, I spent a lot of time understanding how the stanzas of the server itself worked. Designing the chat did not take much time, but the logic to get what I needed, such as contacts, conversations, listening to messages, and obtaining notifications, was practically trial and error. Apparently, there were different ways to do the same thing, and each XMPP connection library had its own ways of doing things.

In my case, a major issue and the reason why I could not deploy the project on Netlify and add it to my portfolio is that there were HTTPS certificates which the server did not have.

## Lessons Learned
The main lessons learned during the development of this project are the following:

- Use of the XMPP protocol.
- What are stanzas?
- How to use stanzas.
- How to integrate XMPP with React.