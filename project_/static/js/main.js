function getMessages() {
    fetch('/get_messages')
        .then(response => response.json())
        .then(messages => {
            const messageContainer = document.getElementById('message-container');
            const ul = messageContainer.querySelector('ul');
            ul.innerHTML = '';

            if (messages.length > 0) {
                messages.forEach(message => {
                    const li = document.createElement('li');
                    li.textContent = `留言: ${message.message} (時間: ${message.time})`;
                    ul.appendChild(li);
                });
            } else {
                ul.innerHTML += '<p>目前沒有留言。</p>';
            }
        });
}

function sendMessage() {
    const messageText = document.getElementById('message-text').value;
    if (messageText.trim() !== '') {
        fetch('/add_message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: messageText })
        })
        .then(() => {
            getMessages();
            document.getElementById('message-text').value = '';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    getMessages();
});
