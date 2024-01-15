function saveGmailRecord(gmail) {
    fetch('/save_gmail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ gmail: gmail })
    })
    .then(response => response.json())
    .then(responseData => {
        console.log(responseData.message);
        // 更新 Gmail 紀錄列表等操作...
    });
}

$(document).ready(function () {
    $('#submit-gmail-btn').click(function (event) {
        event.preventDefault();

        // 獲取 Gmail 數據，這部分根據您的具體實現方式進行調整
        var gmailData = // 獲取 Gmail 相關數據...

        // 呼叫保存 Gmail 紀錄的函數
        saveGmailRecord(gmailData);
    });
});
