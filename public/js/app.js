var title = document.getElementById('title'),
    content = document.getElementById('content'),
    time = document.getElementById('time'),
    inputElement = document.getElementById("input"),
    place = document.getElementById("filePlace"),
    ls = window.localStorage,
    countInterval = null,
    deploy = null,
    icon = '../assets/img/icon.png';

inputElement.addEventListener("change", handleFiles, false);

Notification.requestPermission().then(function(result) {
    if (result == "denied") {
        Materialize.toast('Hey, if you don\'t grant us notification permission, what are you doing here? :|', 3000);
    }
});

function doClick(){
    if (inputElement) {
        inputElement.click();
    }
}

function handleFiles() {
    var fileList = this.files;
    actualFile = fileList[0];
    fileType = actualFile.type;
    slashIndex = fileType.search('/');
    mimeType = fileType.slice(0, slashIndex);
    if (mimeType == 'image') {
        image(actualFile);
    } else {
        Materialize.toast('That\'s no image! Be careful, this is not a game, this is a very delicate process', 3000);
    }
}

function image(actualFile) {
    Materialize.toast('Icon loaded correctly', 2000);
    var reader = new FileReader();
    reader.onload = (function(actualFile){
        return function(e){
            place.innerHTML = ['<img class="responsive-img" src="', e.target.result, '" title="', escape(actualFile.name),'"/>'].join('')
            icon = e.target.result;
        };
    })(actualFile);
    reader.readAsDataURL(actualFile);
}

function launch() {
    var now = Math.floor(Date.now());
    actualTime = Number(time.value) * 1000;
    if (!isNaN(actualTime) && actualTime > 0) {
        var options = {
            body: content.value,
            timestamp: now,
            icon: icon
        }

        Materialize.toast('Launching in...', 3000);
        var counter = time.value;
        countInterval = setInterval(function(){
            var real = counter - 1;
            Materialize.toast(real + '...', 3000);
            if(counter == 1 || real < 0) clearInterval(countInterval);
            counter--;
        }, 1000);

        deploy = setTimeout(function() {
            var notification = new Notification(title.value, options);
            setTimeout(notification.close.bind(notification), 3000);
        }, actualTime);
        elPelucaSaveEnLocal(now);
    } else {
        Materialize.toast('Haha. So. Funny. Do you wanna blow up the world?', 3000);
    }
}

function elPelucaPara() {
    clearTimeout(deploy);
    clearInterval(countInterval);
    Materialize.toast('WOW! Aborted!.... That was close!', 3000)
}

function elPelucaSaveEnLocal(now) {
    var n = {
        title: title.value,
        content: content.value,
        timestamp: now,
    };
    n = JSON.stringify(n);
    ls.LastNotification = n;
}
