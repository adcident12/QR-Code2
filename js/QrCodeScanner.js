var no = 1;
// @ts-ignore
$( document ).ready(function() {
    // @ts-ignore
    var webcameraChanger = $("#webcameraChanger");
    var options = {};
    options = initVideoObjectOptions("webcameraPreview");
    var cameraId = 0;

    initScanner(options);

    initAvaliableCameras(
        webcameraChanger,
        function () {
            // @ts-ignore
            cameraId = parseInt(getSelectedCamera(webcameraChanger));
        }
    );

    initCamera(cameraId);

    scanStart(function (data){
        var timestamp = new Date();
        if(data) {
            // @ts-ignore
            $('#data').append('<tr><td>'+no+'</td><td>'+data+'</td><td>'+formatDate(timestamp, "dddd h:mmtt d MMM yyyy")+'</td></tr>');
        }
        no +=1;
    });
});

// @ts-ignore
scanner = {};

function initHtmlElement(id){
    return document.getElementById(id);
}

function initVideoObjectOptions(id) {
    // @ts-ignore
    scanner = {};
    return  {
        video: initHtmlElement(id),
        continuous: true,
        mirror: false,
        captureImage: false,
        backgroundScan: true,
        refractoryPeriod: 5000,
        scanPeriod: 1
    };

}

function initAvaliableCameras(selectObject, callBack) {
    var max = 0;
    // @ts-ignore
    Instascan.Camera.getCameras().then(function (cameras) {

        for (var i = 0; i < cameras.length; i++) {
            // @ts-ignore
            var o = $("<option value='" + i + "'></option>");
            o.text("Camera #" + i);
            o.appendTo(selectObject);
            max = i;
        }
        selectObject.val(max);
        callBack();
        var countCamera = max +1; 
        // @ts-ignore
        $("#totalCamera").text(" Total Camera "+ countCamera);
    });
}

function getSelectedCamera(selectObject) {
    return parseInt(selectObject.val());
}

function initCamera(i) {
    // @ts-ignore
    scanner.stop();

    // @ts-ignore
    Instascan.Camera.getCameras().then(function (cameras) {
        // @ts-ignore
        scanner.start(cameras[i]);
    });
}

function scanStart(ondetect){
    // @ts-ignore
    scanner.addListener('scan', function (content) {
        ondetect(content);
    });
}

function cameraChange(cameraNum) {
    initCamera(parseInt(cameraNum));
}

function initScanner(options) {
    // @ts-ignore
    scanner = new Instascan.Scanner(options);
}

function formatDate(date, format, utc){
    var MMMM = ["\x00", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var MMM = ["\x01", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var dddd = ["\x02", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var ddd = ["\x03", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    function ii(i, len) { var s = i + ""; len = len || 2; while (s.length < len) s = "0" + s; return s; }

    var y = utc ? date.getUTCFullYear() : date.getFullYear();
    format = format.replace(/(^|[^\\])yyyy+/g, "$1" + y);
    format = format.replace(/(^|[^\\])yy/g, "$1" + y.toString().substr(2, 2));
    format = format.replace(/(^|[^\\])y/g, "$1" + y);

    var M = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
    format = format.replace(/(^|[^\\])MMMM+/g, "$1" + MMMM[0]);
    format = format.replace(/(^|[^\\])MMM/g, "$1" + MMM[0]);
    format = format.replace(/(^|[^\\])MM/g, "$1" + ii(M));
    format = format.replace(/(^|[^\\])M/g, "$1" + M);

    var d = utc ? date.getUTCDate() : date.getDate();
    format = format.replace(/(^|[^\\])dddd+/g, "$1" + dddd[0]);
    format = format.replace(/(^|[^\\])ddd/g, "$1" + ddd[0]);
    format = format.replace(/(^|[^\\])dd/g, "$1" + ii(d));
    format = format.replace(/(^|[^\\])d/g, "$1" + d);

    var H = utc ? date.getUTCHours() : date.getHours();
    format = format.replace(/(^|[^\\])HH+/g, "$1" + ii(H));
    format = format.replace(/(^|[^\\])H/g, "$1" + H);

    var h = H > 12 ? H - 12 : H == 0 ? 12 : H;
    format = format.replace(/(^|[^\\])hh+/g, "$1" + ii(h));
    format = format.replace(/(^|[^\\])h/g, "$1" + h);

    var m = utc ? date.getUTCMinutes() : date.getMinutes();
    format = format.replace(/(^|[^\\])mm+/g, "$1" + ii(m));
    format = format.replace(/(^|[^\\])m/g, "$1" + m);

    var s = utc ? date.getUTCSeconds() : date.getSeconds();
    format = format.replace(/(^|[^\\])ss+/g, "$1" + ii(s));
    format = format.replace(/(^|[^\\])s/g, "$1" + s);

    var f = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
    format = format.replace(/(^|[^\\])fff+/g, "$1" + ii(f, 3));
    f = Math.round(f / 10);
    format = format.replace(/(^|[^\\])ff/g, "$1" + ii(f));
    f = Math.round(f / 10);
    format = format.replace(/(^|[^\\])f/g, "$1" + f);

    var T = H < 12 ? "AM" : "PM";
    format = format.replace(/(^|[^\\])TT+/g, "$1" + T);
    format = format.replace(/(^|[^\\])T/g, "$1" + T.charAt(0));

    var t = T.toLowerCase();
    format = format.replace(/(^|[^\\])tt+/g, "$1" + t);
    format = format.replace(/(^|[^\\])t/g, "$1" + t.charAt(0));

    var tz = -date.getTimezoneOffset();
    var K = utc || !tz ? "Z" : tz > 0 ? "+" : "-";
    if (!utc)
    {
        tz = Math.abs(tz);
        var tzHrs = Math.floor(tz / 60);
        var tzMin = tz % 60;
        K += ii(tzHrs) + ":" + ii(tzMin);
    }
    format = format.replace(/(^|[^\\])K/g, "$1" + K);

    var day = (utc ? date.getUTCDay() : date.getDay()) + 1;
    format = format.replace(new RegExp(dddd[0], "g"), dddd[day]);
    format = format.replace(new RegExp(ddd[0], "g"), ddd[day]);

    format = format.replace(new RegExp(MMMM[0], "g"), MMMM[M]);
    format = format.replace(new RegExp(MMM[0], "g"), MMM[M]);

    format = format.replace(/\\(.)/g, "$1");

    return format;
};