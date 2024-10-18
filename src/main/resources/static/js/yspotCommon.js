/*
 * yspotCommon.js
 * @author: TS.NAM
 * @since: 2024-08-30
 * @version: 1.0
 * Modification Information
 * Mod Date		Modifier			Description
 * ========================================
 *
 *
 * Copyright(c) 2018 KTDS, Inc. All Rights Reserved
 */
$(function() {
    // 화면을 당겨 REFRESH할 경우 스크롤 이벤트 문제 헤결(댓글 입력폼이 열릴 때: false, 닫을 때: true)
    if (isIOS()) {
        let message = { command: 'setAppRefreshEnable', isEnable: true }
        window.webkit.messageHandlers.ySpotCallback.postMessage(message);
    } else {
        window.YSpotWebInterface.setAppRefreshEnable(true);
    }
});


// 무한 스크롤 시 DEBOUNCE 처리
var delayReq = function(func, wait) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
};

// 개행 처리
function replaceBrTag(str) {
    if (str == undefined || str == null) {
        return;
    }

    str = str.replace(/\r\n/ig, '<br>');
    str = str.replace(/\\n/ig, '<br>');
    str = str.replace(/\n/ig, '<br>');

    return str;
}

// 개행 제거
function unreplaceBrTag(str) {
    if (str == undefined || str == null) {
        return;
    }

    str = str.replace(/<br>/ig, '\n');
    str = str.replace(/<\/br>/ig, '\n');
    str = str.replace(/<br \>/ig, '\n');

    return str;
}

// 날짜 표시 양식 설정
function displayTime(date) {
    const now = new Date();
    var dateObj = new Date(date);
    const diffTime = now - dateObj;
    var yy = dateObj.getFullYear();
    var mm = dateObj.getMonth() + 1;
    var dd = dateObj.getDate();
    var hh = dateObj.getHours();
    var mi = dateObj.getMinutes();

    return [yy, '/', (mm > 9 ? '' : '0') + mm, '/', (dd > 9 ? '' : '0') + dd, ' ', (hh > 9 ? '' : '0') + hh, ':', (mi > 9 ? '' : '0') + mi].join('');
}

// 문자열 ELLIPSIS 처리
function truncateText(text, maxlength) {
    if (text.length > maxlength) {
        return text.substring(0, maxlength) + '...';
    } else {
        return text;
    }
}

// 로그인 안 된 경우 로그인 화면으로 이동
function moveLoginForm() {
    var postData = { gm: '1' };
    if (isIOS()) {
        window.webkit.messageHandlers.callBackHandler.postMessage(postData);
    } else {
        window.YSpotWebInterface.requestAppLogin();
    }
}
// 중복 로그인 관련 API
function moveLoginFormForDualLogin(content) {
    if (isIOS()) {
        let message= { command: 'showErrorMessage', code:410, message: content}
        let postData = { gm: '1' };
        window.webkit.messageHandlers.ySpotCallback.postMessage(message);
        window.webkit.messageHandlers.callBackHandler.postMessage(postData);
    } else {
        window.YSpotWebInterface.showErrorMessage("410", content);
    }
}


// 앱에서 로그인 완료 시 이 함수를 호출하며 웹뷰에서 로그인 완료에 대한 처리를 해준다.
function appLoginFinished(ysid, autoLogin, osTp, appVrsn, mobileCd, osVrsn) {
    let $form = $('<form></form>');
    $form.attr('method', 'POST');
    $form.attr('action', '/yapp4/yspot/main');

    $('<input>').attr({type: 'hidden', name: 'ysid', value: ysid}).appendTo($form);
    $('<input>').attr({type: 'hidden', name: 'autoLogin', value: autoLogin}).appendTo($form);
    $('<input>').attr({type: 'hidden', name: 'osTp', value: osTp}).appendTo($form);
    $('<input>').attr({type: 'hidden', name: 'appVrsn', value: appVrsn}).appendTo($form);
    $('<input>').attr({type: 'hidden', name: 'mobileCd', value: mobileCd}).appendTo($form);
    $('<input>').attr({type: 'hidden', name: 'osVrsn', value: osVrsn}).appendTo($form);

    $form.appendTo('body').submit();
}

// YSPOT 페이지 접속 시마다 웹뷰를 통해 전달되는 로그인 관련 정보 설정
function webViewDidAppear(isLogin, ysid, autoLogin, osTp, appVrsn, mobileCd, osVrsn) {
    if (osTp === 'G0002') {
        $('[name=ysid]').val(ysid);
        $('[name=autoLogin]').val(autoLogin);
        $('[name=osTp]').val(osTp);
        $('[name=appVrsn]').val(appVrsn);
    }
}

// 스크롤 기능 비활성화
function scrollDisable() {
    $('body').addClass('overflow-hidden');
    $('.overflow-hidden').on('scroll touchmove mousewheel', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    });
}

// 스크롤 기능 활성화
function scrollable() {
    $('body').removeClass('overflow-hidden');
    $('.overflow-hidden').off('scroll touchmove mousewheel');
}

// iOS 단말기 구분
function isIOS() {
    var userAgent = navigator.userAgent.toLowerCase();

    return ((userAgent.search('iphone') > -1) || (userAgent.search('ipod') > -1) || (userAgent.search('ipad') > -1));
}

// 좌상단 뒤로 가기 버튼 클릭 시
$('.fa-back').on('click', function() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        if ($('#listFrm').length) {
            $('#listFrm').attr('action', '/yapp4/yspot/main').submit();
        } else {
            $('#frm').attr('action', '/yapp4/yspot/main').submit();
        }
    }
});

function getCloverPopup(issueCloverCnt) {
    return $('<div id="clover_issue_popup" class="popup" style="z-index:4;"><div class="popup alert">\n' +
        '\t\t<div class="popup-dimmed"></div>\n' +
        '\t\t<div class="popup-inner alert">\n' +
        '\t\t\t<div class="popup-inner-content">\n' +
        '\t\t\t\t<img src="/yapp4/res/v4/assets/images/icon/clover_ill.png" alt="클로버" />\n' +
        '\t\t\t\t<p class="clover-paid">\n' +
        '\t\t\t\t\t클로버 지급<br /> <span id="clover_issue_cnt">' + issueCloverCnt + '</span>\n' +
        '\t\t\t\t</p>\n' +
        '\t\t\t</div>\n' +
        '\t\t\t<div class="popup-inner-footer">\n' +
        '\t\t\t\t<button id="issue_clover_ok" class="alert"><span>확인</span></button>\n' +
        '\t\t\t</div>\n' +
        '\t\t</div>\n' +
        '\t</div></div>');
}

/**
 * clover issue popup
 * @param issueCloverCnt
 */
function cloverIssuePop(issueCloverCnt){
    const $cloverPopup = getCloverPopup(issueCloverCnt);
    $('body').append($cloverPopup);
    $("#clover_issue_popup").on('click','#issue_clover_ok',function(){
        $("#clover_issue_popup").remove();
    });
}

/**
 * clover issue popup
 * @param issueCloverCnt
 * @param loc
 */
function cloverIssuePopWithAction(issueCloverCnt, loc){
    const $cloverPopup = getCloverPopup(issueCloverCnt);
    $('body').append($cloverPopup);
    $("#clover_issue_popup").on('click','#issue_clover_ok',function(){
        $("#clover_issue_popup").remove();
        //와글와글 게시글 작성에서 목록으로 이동 처리..
        if(loc === "WR"){
            $('#frm').attr('action', '/yapp4/yspot/wgwg/main').submit();
        }
    });
}
//뒤로가기시 새로운 페이지 호출 로직 추가 jgk 20243.10.04 -S
function preventBackNavigation(){

    const curUrl = window.location.href;
    history.pushState(null, null, curUrl);

    const referer = document.referrer;
    let moveLoc = referer.substring(referer.indexOf("/yapp4"),referer.length);
    if(curUrl.indexOf("/yspot/cos/main") > -1 || curUrl.indexOf("/yspot/pod/main") > -1 ||  curUrl.indexOf("/yspot/wgwg/main") > -1){
        moveLoc = "/yapp4/yspot/main";
    } else if(curUrl.indexOf("/yspot/wgwg/view") > -1){
        moveLoc = "/yapp4/yspot/wgwg/main"
    }
    console.log(moveLoc);
// 뒤로가기 버튼 또는 history.back() 호출 시 막고 커스텀 동작 수행
    window.addEventListener('popstate', function(event) {
        // 다시 현재 상태를 히스토리에 추가하여 뒤로가기 기능을 막음
        history.pushState(null, null,moveLoc);
        //window.location.href = moveLoc;

        let formObj = ($('#listFrm').length) ? $('#listFrm') : $('#frm');
        if (moveLoc) {
            $(formObj).attr('action', moveLoc).submit();
        } else {
            $(formObj).attr('action', "/yapp4/yspot/main").submit();
        }
    });
}
// -E


function getCommonPopup(content) {
    return $('<div id="common_popup" class="popup" style="z-index:4;"><div class="popup alert">\n' +
        '\t\t<div class="popup-dimmed"></div>\n' +
        '\t\t<div class="popup-inner alert">\n' +
        '\t\t\t<div class="popup-inner-content">\n' +
        '\t\t\t\t<p>\n' +
        '\t\t\t\t\t' + content +
        '\t\t\t\t</p>\n' +
        '\t\t\t</div>\n' +
        '\t\t\t<div class="popup-inner-footer">\n' +
        '\t\t\t\t<button id="common_ok" class="alert"><span>확인</span></button>\n' +
        '\t\t\t</div>\n' +
        '\t\t</div>\n' +
        '\t</div></div>');
}

/**
 * commonPop
 * @param issueCloverCnt
 */
function commonPop(content, action){
    const $commonPop = getCommonPopup(content);
    $('body').append($commonPop);
    $("#common_popup").on('click','#common_ok',function(){
        $("#common_popup").remove();
        action();
    });
}