function recordLearning() {
    const scoreInput = document.getElementById('score');
    const learningTimeInput = document.getElementById('learningTime');

    // 獲取用戶輸入的值
    const score = scoreInput.value;
    const learningTime = learningTimeInput.value;

    // 驗證輸入值是否在合理範圍內
    if (score < 0 || score > 100 || learningTime < 0 || learningTime > 10) {
        alert("請輸入有效的數值，學習成效應在0-100之間，學習時間應在0-10之間。");
        return;
    }

    // 使用Ajax向後端發送數據
    $.ajax({
        url: '/record_learning',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            Score: score,
            LearningTime: learningTime
        }),
        success: function(response) {
            document.getElementById('responseMessage').innerText = response.message;
            alert("學習計畫：" + response.learning_plan);
        },
        error: function(error) {
            document.getElementById('responseMessage').innerText = '發生錯誤。';
            console.error(error);  // 打印錯誤信息到控制台
        }
    });
}
