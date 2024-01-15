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

function submitForm(event) {
    event.preventDefault(); // 阻止表單的預設行為

    const formData = new FormData(document.getElementById('submit-form'));

    fetch('/submit', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(responseData => {
        // 將伺服器回應顯示在指定的元素中
        document.getElementById('submit-message').innerText = responseData;

        // 清空表單
        document.getElementById('submit-form').reset();

        // 更新留言列表
        getMessages();
    });
}
