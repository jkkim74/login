$(document).ready(function() {
    const MAX_FILES = 4;
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const MAX_TOTAL_SIZE = 20 * 1024 * 1024; // 20MB

    $('#wgwgImgFileUpload').on('change', function(event) {
        const files = Array.from(event.target.files);
        const $previewContainer = $('#selectedImg');
        const currentFilesCount = $previewContainer.find('.regist-upload-image').length;
        let totalSize = 0;
        let message = '';

        // Clear previous error messages
        showValidMsgLayer('', null);

        // Check if adding these files exceeds the maximum allowed files
        if (currentFilesCount + files.length > MAX_FILES) {
            showValidMsgLayer(`You can upload a maximum of ${MAX_FILES} images.`,null);
            return;
        }

        // Validate each file
        files.forEach((file) => {
            // Check if file is an image
            if (!file.type.startsWith('image/')) {
                message += `${file.name} is not an image file. Only image files are allowed.\n`;
                return;
            }

            // Check individual file size
            if (file.size > MAX_FILE_SIZE) {
                message += `${file.name} exceeds the 5MB limit.\n`;
                return;
            }

            totalSize += file.size;

            // Create a FileReader to read the image
            const reader = new FileReader();
            reader.onload = function(e) {
                const $imageContainer = $('<div>').addClass('regist-upload-image');
                const $img = $('<img>').attr('src', e.target.result).data('fileSize', file.size);
                const $removeBtn = $('<button>')
                    .addClass('remove-btn')
                    .text('X')
                    .on('click', function() {
                        $imageContainer.remove(); // Remove the image container
                        updateTotalSize(); // Recalculate the total size
                    });

                $imageContainer.append($img).append($removeBtn);
                $previewContainer.append($imageContainer);
            };

            reader.readAsDataURL(file);
        });

        // Check total file size
        if (totalSize + getCurrentTotalSize() > MAX_TOTAL_SIZE) {
            showValidMsgLayer('Total file size exceeds the 20MB limit.',null);
            return;
        }

        // Display error messages if any
        // if (message.trim() != "") {
        //     showValidMsgLayer(message,null);
        // } else {
            // Clear the file input so that the same files can be re-selected if needed
            $('#wgwgImgFileUpload').val('');
       // }
    });

    // Function to calculate the current total size of all images
    function getCurrentTotalSize() {
        let total = 0;
        $('#selectedImg img').each(function() {
            total += $(this).data('fileSize') || 0;
        });
        return total;
    }

    // Function to update the total size after removing an image
    function updateTotalSize() {
        let currentTotal = getCurrentTotalSize();
        //showValidMsgLayer(`Current total size: ${(currentTotal / (1024 * 1024)).toFixed(2)}MB`,null);
    }

    // Function to show the popup with a message
    var showValidMsgLayer = function(msgStr, obj) {
        $('#validMsg').html(msgStr);
        if (obj) {
            targetIdObj = obj;
        }
        $('#validMsgPopup').show();
    };


    // Hide the popup when the close button is clicked
    $('#popupCloseBtn').on('click', function() {
        $('#validMsgPopup').hide();
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

    // // Remove all images when the "Remove All" button is clicked
    // $('#removeAllBtn').on('click', function() {
    //     $('#preview').empty();
    //     $('#popupMessage').text('');
    // });
    //
    // $('#uploadForm').on('submit', function(event) {
    //     event.preventDefault();
    //     showPopup("Files are ready to be uploaded!");
    //     // Additional validation or file upload logic can be added here
    // });
});