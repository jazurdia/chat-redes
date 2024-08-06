function ChatWindow() {
    return (
        <div className='w-full h-full p-4'>
            <h1>Chat Window</h1>
            <div>
                aqui iran los mensajes.
            </div>
            <div>
                <input type="text" placeholder="Escribe un mensaje" />
                <button>Enviar</button>
            </div>
        </div>
    );
}

export default ChatWindow;