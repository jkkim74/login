/*
 * wgwg.js
 * @author: TS.NAM
 * @since: 2024-08-23
 * @version: 1.0
 * Modification Information
 * Mod Date		Modifier			Description
 * ========================================
 *
 *
 * Copyright(c) 2018 KTDS, Inc. All Rights Reserved
 */

let uploadedImages = [];
let uploadedImageUrls = [];

let ltdedSizePerFile = 5 * 1024 * 1024; // 파일별 5MB로 설정
let totalLtdedSize = 20 * 1024 * 1024; // 전체 업로드 용량 20MB로 설정
let allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
let allowedFileExt = ['jpeg', 'jpg', 'png', 'gif'];
let maxFiles = 4;	// 최대 4개까지만 업로드 가능
let sizeSum = 0;	// 전체 업로드 용량 확인
let imgCnt = 0;

$(function() {
    $('#placeIntro').css('white-space', 'pre-wrap').attr('placeholder', '지역 및 장소:\n\n간단한 소개:');

    $('#wgwgImgFileUpload').off('change').on('change', function(e) {
        let files = $(this)[0].files;

        // let isValid = validateFiles(files);
        // if (!isValid) {
        // 	$('#wgwgImgFileUpload').val('');
        // 	return;
        // }
        let existedImageCnt = (typeof uploadedImgCnt !== 'undefined') ? uploadedImgCnt : 0;
        imgCnt = files.length + uploadedImages.length + existedImageCnt;
        console.log('CHECK files.length:', files.length, ' /// uploadedImages.length:', uploadedImages.length, ' /// existedImageCnt:', existedImageCnt);
        if (imgCnt > maxFiles) {
            let msgStr = '사진은 최대 4개까지만 등록할 수 있어요.';
            showValidMsgLayer(msgStr, null);
            return false;
        }

        // 임시 저장을 위한 배열
        let tempImageUrls = [];
        let processedImgCnt = 0;

        try {
            for (let i = 0; i < files.length; i++) {
                let file = files[i];

                // 파일 확장자 검증
                let fileType = file.type;
                let fileName = file.name;
                let fileSize = file.size;
                let fileExt = fileName.split('.').pop().toLowerCase();

                if (!allowedFileTypes.includes(fileType) && !allowedFileExt.includes(fileExt)) {
                    let msgStr = '이미지 파일만 등록할 수 있어요.<br>(jpeg, png, gif)';
                    showValidMsgLayer(msgStr, null);
                    return false;
                }

                // 파일별 크기 검증
                // if (fileSize > ltdedSizePerFile) {
                // 	let msgStr = '각 이미지 파일은 최대 5MB까지만 업로드 가능해요.';
                // 	showValidMsgLayer(msgStr, null);
                // 	return false;
                // }

                uploadedImages.push(file);

                // 이미지 크기를 100x100으로 리사이즈
                resizeImage(file, 100, 100, function(resizedFile) {
                    const imageUrl = URL.createObjectURL(resizedFile);
                    tempImageUrls.push(imageUrl);

                    processedImgCnt++;

                    // 리사이징된 이미지를 화면에 표시
                    console.log('CHECK processedImgCnt:', processedImgCnt, ' /// files.length:', files.length);
                    if (processedImgCnt === files.length) {
                        displayThumbnails(tempImageUrls);

                        // 'CHANGE' 이벤트가 정상적으로 동작할 수 있도록 처리 완료 후 초기화
                        $('#wgwgImgFileUpload').val('');
                    }
                });
            }
        } catch (err) {
            console.log(err);
            $('#wgwgImgFileUpload').val('');
            tempImageUrls = [];
            processedImgCnt = 0;

            let msgStr = '이미지 처리 중 문제가 발생했어요.<br>다시 시도해 주세요.';
            showValidMsgLayer(msgStr, null);
        }
    });

    $('#selectedImg').on('click', '.regist-upload-image span', function() {
        let imgWrapper = $(this).closest('.regist-upload-image');
        let index = imgWrapper.data('index');
        console.log(index);
        if (index !== -1) {
            try {
                URL.revokeObjectURL(uploadedImageUrls[index]);
                uploadedImages.splice(index, 1);
                uploadedImageUrls.splice(index, 1);

                imgWrapper.remove();

                $('#selectedImg .regist-upload-image').each(function(idx) {
                    $(this).attr('data-index', idx);
                });
            } catch (e) {
                console.log(e);
            }
        }
    });
});

function resizeImage(file, maxWidth, maxHeight, callback) {
    const reader = new FileReader();

    reader.onload = function(event) {
        const img = new Image();
        img.src = event.target.result;

        img.onload = function() {
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(function(blob) {
                const resizedFile = new File([blob], file.name, { type: file.type });
                callback(resizedFile);
            }, file.type);
        };
    };

    reader.readAsDataURL(file);
}

function displayThumbnails(imageUrls) {
    // let fragment = $(document.createDocumentFragment());
    let htmlStr = '';
    let currIdx = $('#selectedImg .regist-upload-image').length;

    for (let i = 0; i < imageUrls.length; i++) {
        let imageUrl = imageUrls[i];
        // let compressedFile = compressedImages[i];

        // let imgWrapper = $('<div class="regist-upload-image" style="position: relative; display: inline-block;" data-index="' + i + '"></div>');
        // let img = $('<img src="' + imageUrl + '" alt="">');
        // let deleteIcon = $('<span style="position: absolute; top: 0; right: 0; background: rgba(255, 0, 0, 0.7); color: white; border-radius: 50%; width: 20px; height: 20px; text-align: center; cursor: pointer;">&times;</span>');

        // imgWrapper.append(img).append(deleteIcon);
        // fragment.append(imgWrapper);

        let imgIdx = currIdx + i;

        htmlStr += '<div class="regist-upload-image" style="position: relative; display: inline-block;" data-index="' + imgIdx + '">' +
            '<img src="' + imageUrl + '" alt="">' +
            '<span style="position: absolute; top: 0; right: 0; background: rgba(255, 0, 0, 0.7); color: white; border-radius: 50%; width: 20px; height: 20px; text-align: center; cursor: pointer;">&times;</span>' +
            '</div>';
        uploadedImageUrls.push(imageUrl);
    }

    // $('#selectedImg').append(fragment);
    $('#selectedImg').append(htmlStr);
}

var getDataList = function(pageNo) {
    $.ajax({
        url: targetUrl
        , type: 'GET'
        , data: {currPageNo: pageNo, endOffset: 5, sortFlag: $('#sortFlag').val(), pageBarSize: 5}
        , contentType: 'application/json'
    })
        .done(function(resData) {
            let conts = '';
            $.each(resData.wgwgList, function(i, col) {
                let likeImg = '';
                if (col.myLike == 'Y') {
                    likeImg = 'icon_like_on.svg';
                } else {
                    likeImg = 'icon_like_line.svg';
                }

                conts += '<div class="spot-list-item">' +
                    '  <div class="spot-list-item-info">' +
                    '	  <p class="writer">' +
                    '			<span>' + col.userId + '</span>' +
                    '		</p>' +
                    '    <p class="title ellipsis" data-key="' + col.wgSeq + '">' +
                    '      <span>' + truncateText(col.title, 20) + '</span>' +
                    '    </p>' +
                    '		<div class="spot-list-item-comment">' +
                    '			<p class="tag-row">' +
                    '				<span class="tag">'  + ((col.hashtags === null || col.hashtags === 'null') ? '' : col.hashtags) + '</span>' +
                    '			</p>' +
                    '  		<span><img name="wgwgReplyBtn" data-wg_seq="' + col.wgSeq + '" src="' + contextPath + '/res/v4/assets/images/icon/icon_comment.svg" alt="">' + col.replyCnt + '</span>' +
                    '  		<span name="wgwgLikeSpan"><img name="wgwgLikeBtn" data-wg_seq="' + col.wgSeq + '" src="' + contextPath + '/res/v4/assets/images/icon/' + likeImg + '" alt="">' + col.likeCntStr + '</span>' +
                    '		</div>' +
                    '	</div>' +
                    '	<div class="spot-list-item-thumb" data-key="'+col.wgSeq+'">' +
                    '		<img class="thumb-img" src="' + col.conDtl + '" onerror="this.onerror=null;this.src=\''+contextPath+'/res/v4/assets/images/icon/logo_black.svg\';" alt="">' +
                    '	</div>' +
                    '</div>';
            });
            $('#wgwgListDiv').empty();
            $('#wgwgListDiv').append(conts);

            $('#pageNavBar').empty();
            $('#pageNavBar').append(resData.pageBar);
        })
        .fail(function(e) {
            console.log(e);
        });
};

$('#pageNavBar').on('click', '#btnPrev, a[data-page], #btnNext, #btnLast', function(e) {
    e.preventDefault();
    let pageVal = $(this).data('page');
    getDataList(pageVal);
});

var validateFiles = function(files) {
    let existedImageCnt = (typeof uploadedImgCnt !== 'undefined') ? uploadedImgCnt : 0;
    imgCnt = files.length + uploadedImages.length + existedImageCnt;
    if (imgCnt > maxFiles) {
        let msgStr = '사진은 최대 4개까지만 등록할 수 있어요.';
        showValidMsgLayer(msgStr, null);
        return false;
    }

    for (let i = 0; i < files.length; i++) {
        let file = files[i];

        // 파일 확장자 검증
        if (!allowedFileTypes.includes(file.type)) {
            let msgStr = '이미지 파일만 등록할 수 있어요.(jpeg, png, gif)';
            showValidMsgLayer(msgStr, null);
            return false;
        }

        // 파일별 크기 검증
        if (file.size > ltdedSizePerFile) {
            let msgStr = '각 이미지 파일은 최대 5MB까지만 업로드 가능해요.';
            showValidMsgLayer(msgStr, null);
            return false;
        }

        sizeSum += file.size;
    }

    // 전체 용량 검증
    if (sizeSum > totalLtdedSize) {
        let msgStr = '전체 용량은 20MB까지만 업로드 가능해요.';
        showValidMsgLayer(msgStr, null);
        return false;
    }

    return true;
};

var deleteUploadedImage = function() {
    let formData = new FormData();
    for (let i = 0; i < conDtlToDelete.length; i++) {
        formData.append('conDtlToDelete', conDtlToDelete[i]);
        if (conDtlToDeleteSeq && conDtlToDeleteSeq.length > 0) {
            // console.log('CHECK WG_CON_SEQ:', conDtlToDeleteSeq[i]);
            formData.append('conDtlToDeleteSeq', conDtlToDeleteSeq[i]);
        }
    }

    $.ajax({
        type: 'POST'
        , headers: {
            cntrNo: $('[name=cntrNo]').val()
            , ysid: $('[name=ysid]').val()
            , autoLogin: $('[name=autoLogin]').val()
            , osTp: $('[name=osTp]').val()
            , appVrsn: $('[name=appVrsn]').val()
        }
        , url: contextPath + '/yspot/wgwg/rest/deleteUploadedImages'
        , data: formData
        , processData: false
        , contentType: false
        , cache: false
    })
        .done(function(resData) {
            conDtlToDelete = [];
            uploadImage();
        })
        .fail(function(e) {
            console.log(e);
        });
};

var uploadImage = function() {
    $.ajax({
        type: 'POST'
        , headers: {
            cntrNo: $('[name=cntrNo]').val()
            , ysid: $('[name=ysid]').val()
            , autoLogin: $('[name=autoLogin]').val()
            , osTp: $('[name=osTp]').val()
            , appVrsn: $('[name=appVrsn]').val()
        }
        , url: contextPath + '/yspot/wgwg/rest/uploadImages'
        , data: new FormData($('#frm')[0])
        , processData: false
        , contentType: false
        , cache: false
    })
        .done(function(resData) {
            console.log('CHECK RESULT DATA >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', resData);
            let selectedFilesInfo = '';
            $.each(resData, function(i, imgUrl) {
                selectedFilesInfo += '<div class="regist-upload-image">' +
                    '  <span class="count">' + (i + 1) + '</span>' +
                    '  <img src="' + imgUrl + '" alt="">' +
                    '</div>';
            });
            $('#selectedImg').empty();
            $('#selectedImg').append(selectedFilesInfo);

            // 업로드 처리 후 와글와글 콘텐츠 상세 정보 저장을 위한 설정
            uploadedImages = resData;

            // 이미지 변경 시 기존 이미지 삭제를 위한 설정
            conDtlToDelete = resData;
        })
        .fail(function(e) {
            let msgStr = '처리 중 오류가 발생하였습니다.<br>잠시 후 다시 시도해 주세요';
            showValidMsgLayer(msgStr, null);
        });
};

let targetIdObj;

$('#saveBtn').on('click', function(e) {
    e.preventDefault();

    let title = $('#title').val().trim();
    if (title === '') {
        let msgStr = '제목을 입력하세요.';
        showValidMsgLayer(msgStr, $('#title'));
        return;
    } else if (title.length > 150) {
        let msgStr = '제목은 150자 이내로 작성해 주세요.';
        showValidMsgLayer(msgStr, $('#title'));
        return;
    }

    let hashtags = $('#hashtags').val().trim();
    if (hashtags.length > 100) {
        let msgStr = '해시태그는 100자 이내로 작성해 주세요.';
        showValidMsgLayer(msgStr, $('#hashtags'));
        return;
    } else {
        let words = hashtags.split(' ');
        if (words.length > 3) {
            let msgStr = '해시태그는 3개 이내로 작성해 주세요.';
            showValidMsgLayer(msgStr, $('#hashtags'));
            return;
        }
    }

    let uploadedCnt = (typeof uploadedImgCnt !== 'undefined') ? uploadedImgCnt : 0;
    if (imgCnt === 0 && uploadedCnt === 0) {
        let msgStr = '이미지를 등록해 주세요.';
        showValidMsgLayer(msgStr, null);
        return;
    }

    let placeIntro = $('#placeIntro').val().trim();
    if (placeIntro === '') {
        let msgStr = '내용을 입력하세요.';
        showValidMsgLayer(msgStr, $('#placeIntro'));
        return;
    } else if (placeIntro.length > 1900) {
        let msgStr = '내용으로 입력할 수 있는 범위를 초과하였습니다.<br>입력하신 내용을 확인해 주세요.';
        showValidMsgLayer(msgStr, $('#placeIntro'));
        return;
    }

    $('#comFirmMsg').text('저장하시겠어요?');
    $('#confirmMsgPopup').show();
});

var showValidMsgLayer = function(msgStr, obj) {
    $('#validMsg').html(msgStr);
    if (obj) {
        targetIdObj = obj;
    }
    $('#validMsgPopup').show();
};

// 메시지 출력 공통 오버레이 확인 버튼 클릭 시
$('#validOkBtn').on('click', function(e) {
    e.preventDefault();
    $('#validMsgPopup').css('display', 'none');
    if (targetIdObj) {
        targetIdObj.focus();
        targetIdObj = '';
    }
});

$('#cfrmCancelBtn').on('click', function(e) {
    e.preventDefault();
    $('#confirmMsgPopup').css('display', 'none');
});

$('#cfrmOkBtn').on('click', function(e) {
    e.preventDefault();
    $('#confirmMsgPopup').css('display', 'none');
    saveWgwg();
    $('#saveBtn').prop('disabled', true);
});