/**
 * Created by Azamat Mirvosiqov on 29.01.2015.
 */

var curUrl = window.location.href;
var arCurUrl = curUrl.split('/');
var noImageTitle = 'Rasmsiz';
var setImageTitle = 'Rasmli';
switch (arCurUrl[3]){
    case 'uz':
        noImageTitle = 'Rasmsiz';
        setImageTitle = 'Rasmli';
        break;
    case 'ru':
        noImageTitle = 'Р‘РµР· РєР°СЂС‚РёРЅРєРё';
        setImageTitle = 'РЎ РєР°СЂС‚РёРЅРєРѕР№';
        break;
    case 'en':
        noImageTitle = 'Without a picture';
        setImageTitle = 'With a picture';
        break;
}

var min = 14,
    max = 30;

function makeNormal() {
    $('html').removeClass('blackAndWhite blackAndWhiteInvert');
    $.removeCookie('specialView', {path: '/'});
}

function makeBlackAndWhite() {
    makeNormal();
    $('html').addClass('blackAndWhite');
    $.cookie("specialView", 'blackAndWhite', {path: '/'});
}

function makeBlackAndWhiteDark() {
    makeNormal();
    $('html').addClass('blackAndWhiteInvert');
    $.cookie("specialView", 'blackAndWhiteInvert', {path: '/'});
}

function makeSetImage() {
    $('html').removeClass( "noImage" );
    //$('.spcImage').removeClass( "spcSetImage" );
    $('.spcNoImage').removeClass( "spcSetImage" );
    $('.spcNoImage').attr('data-original-title', setImageTitle);
      $('.spcNoImage').attr('title', setImageTitle);
    $.removeCookie('specialViewImage', {path: '/'});
}

function makeNoImage() {
    $('html').stop().addClass( "noImage" );
    $('.spcNoImage').addClass( "spcSetImage" );
    $('.spcNoImage').attr('data-original-title', noImageTitle);
     $('.spcNoImage').attr('title', noImageTitle);
    $.cookie("specialViewImage", 'noImage', {path: '/'});
}

function offImages(){
    if ($.cookie("specialViewImage") == 'noImage'){
        makeSetImage();
    } else {
        makeNoImage();
    }
}

function setFontSize(size) {
    if (size < min) {
        size = min;
    }
    if (size > max) {
        size = max;
    }
    $('.container').css({'font-size': parseInt(size) + 1 + 'px'});
   
}

function saveFontSize(size) {
    $.cookie("fontSize", size, {path: '/'});
}
function changeSliderText(sliderId, value) {
    var position = Math.round(Math.abs((value - min) * (100 / (max - min))));
    $('#' + sliderId).prev('.sliderText').children('.range').text(position);
}

function setNarrator() {
    $('head').append($('<script type="text/javascript"><\/script>').attr('src', '/js/narrator.js'));
    console.log($('head'));
    narrator.init();
    $.cookie("narrator", 'on', {path: '/'});
    if (typeof($.cookie("speechVolume")) == 'undefined') {
        $("#speechVolume").slider('value', 100);
        $('#speechOptions .sliderText .range').text(100);
    } else {
        var speechVolume = $.cookie("speechVolume");
        $("#speechVolume").slider('value', speechVolume);
        $('#speechOptions .sliderText .range').text(speechVolume);
    }
}

function unsetNarrator() {
    $.cookie("narrator", null, { path: '/' });
    $('#speech').remove();
    removeJsCssFile('narrator.js', 'js');
}

function saveSpeechVolume(val) {
    if (val > 100 || val < 25) {
        val = 100;
    }
    narrator.setVolume(val);
    $.cookie("speechVolume", val, {path: '/'});
}

$(document).ready(function () {
    var appearance = $.cookie("specialView");
    switch (appearance) {
        case 'blackAndWhite':
            makeBlackAndWhite();
            break;
        case 'blackAndWhiteInvert':
            makeBlackAndWhiteDark();
            break;
    }
    var noimage = $.cookie("specialViewImage");
    switch (noimage) {
        case 'noImage':
            makeNoImage();
            break;
        case 'setImage':
            makeSetImage();
            break;
    }

    $('.no-propagation').click(function (e) {
        e.stopPropagation();
    });

    $('.appearance .spcNormal').click(function () {
        makeNormal();
    });
    $('.appearance .spcWhiteAndBlack').click(function () {
        makeBlackAndWhite();

    });
    $('.appearance .spcDark').click(function () {
        makeBlackAndWhiteDark();
    });

    $('.appearance .spcNoImage').click(function () {
        offImages();
    });


    $('#speechSwitcher').change(function () {
        if (this.checked) {
            var narratorStatus = $.cookie("narrator");
            $('#speechOptions').slideDown(100);
            setNarrator();
            if (narratorStatus != 'on')
                narrator.speak($(this).attr('title'));
            $(".speech").stop().animate({opacity:1}, "fast").addClass('speechHover');
        } else {
            $('#speechOptions').slideUp(100);
            unsetNarrator();
            $(".speech").stop().removeClass('speechHover');
        }
    });

    $('#fontSizer').slider({
        min: min,
        max: max,
        range: "min",
        slide: function (event, ui) {
            setFontSize(ui.value);
            changeSliderText('fontSizer', ui.value);
        },
        change: function (event, ui) {
            saveFontSize(ui.value);
        }
    });

    $('#speechVolume').slider({
        min: 25,
        max: 100,
        range: "min",
        slide: function (event, ui) {
            $('#speechVolume').prev('.sliderText').children('.range').text(ui.value);
        },
        change: function (event, ui) {
            saveSpeechVolume(ui.value);
        }
    });

    var fontSize = $.cookie("fontSize");
    if (typeof(fontSize) != 'undefined') {
        $("#fontSizer").slider('value', fontSize);
        setFontSize(fontSize);
        changeSliderText('fontSizer', fontSize);
    }

    Mousetrap.bind(['shift+return'], function() {
        $('#speechSwitcher').prop('checked', !$('#speechSwitcher').prop('checked'));
        $('#speechSwitcher').trigger('change');
        return false;
    });

    if ($.cookie("narrator") == 'on' && typeof($.cookie("narrator")) != 'undefined'){
        $('#speechSwitcher').prop('checked', true);
        $('#speechSwitcher').trigger('change');
        var speechVolume = $.cookie("speechVolume");
        if (typeof(speechVolume) != 'undefined') {
            $("#speechVolume").slider('value', speechVolume);
            $('#speechOptions .sliderText .range').text(speechVolume);
        }
        if (typeof(speechNotification) != 'undefined'){
            narrator.speak(speechNotification);
        }

        Mousetrap.bind(['ctrl+shift'], function() {
            narrator.stop();
            $('#speechArea').removeClass('narratorBox');
            return false;
        });

        Mousetrap.bind(['ctrl+alt'], function() {
            if (typeof($('#speechArea')) != 'undefined'){
                $('#speechArea').addClass('narratorBox');
                $('#speechArea').append('<div class="loading"></div>');
                narrator.speak($('#speechArea').text());
            }
            return false;
        });
    }
});