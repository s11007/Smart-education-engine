// video.js

$(document).ready(function () {
    $('#video-search-form').submit(function (event) {
        event.preventDefault(); // 阻止表單的默認提交行為
        var selectedCategory = $('#category-selection').val();
        $.post('/videos', { categories: selectedCategory }, function (response) {
            var videos = response.videos;
            $('#video-results').empty();
            for (var i = 0; i < videos.length; i++) {
                var video = videos[i];
                var videoElement = '<div class="video">' +
                                   '<p>Title: ' + video.title + '</p>' +
                                   '<iframe width="560" height="315" src="' + video.link + '" frameborder="0" allowfullscreen></iframe>' +
                                   '</div>';
                $('#video-results').append(videoElement);
            }
        })
        .done(function () {
            // 處理 Ajax 請求成功後的操作，如果需要的話
        })
        .fail(function () {
            // 處理 Ajax 請求失敗後的操作，如果需要的話
        });
    });
});
