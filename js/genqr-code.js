// @ts-ignore
$( document ).ready(function() {
    // @ts-ignore
    bootstrapValidate('#equipment-id', 'integer:The value is not an integer!', function (isValid) {
        if (isValid) {
            // @ts-ignore
            $('#submit').removeAttr("disabled");
        } else {
            // @ts-ignore
            $('#submit').attr("disabled", "disabled");
        }
    });
    // @ts-ignore
    var qrcode = new QRCode("qrcode");
    // @ts-ignore
    $( "#submit" ).click(function() {
        // @ts-ignore
        var equipment =  $('#equipment-id').val()
        if(equipment) {
            qrcode.makeCode(equipment);
            // @ts-ignore
            $('#tiger').val(equipment);

        }else {
            // @ts-ignore
            swal({
                title: "Again!",
                text: "Please enter the device number!.",
                icon: "warning",
                button: "OK",
            });
        }
    });
    // @ts-ignore
    $( "#export" ).click(function() {
        var canvas = document.getElementsByTagName("canvas");
        // @ts-ignore
        var tiger =  $('#tiger').val();
        if(tiger != "") {
            var img    = canvas[0].toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
            var link = document.createElement('a');
            link.download = tiger+".png";
            link.href = img;
            link.click();
        }else {
            // @ts-ignore
            swal({
                title: "Again!",
                text: "Please Generate Qr code!.",
                icon: "warning",
                button: "OK",
            });
        }
    });
});