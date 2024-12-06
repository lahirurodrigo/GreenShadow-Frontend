$('#btnFieldSave').on('click', () => {
    const formData = new FormData();
    formData.append("fieldCode", $('#fieldCode').val());
    formData.append("fieldName", $('#fieldName').val());
    formData.append("fieldLocation", $('#fieldLocation').val());
    formData.append("fieldSize", $('#fieldSize').val());
    formData.append("fieldImage01", $('#fieldImage01')[0].files[0]);
    formData.append("fieldImage02", $('#fieldImage02')[0].files[0]);
    formData.append("cropCode", $('#field-crop-code').val());
    console.log([...formData.entries()]); // For debugging purposes
    if (!validateField(formData)) {
        return;
    }
    console.log(token)
    $.ajax({
        method: "POST",
        url: baseUrl + `fields`,
        data: formData,
        contentType: false, // Required for FormData
        processData: false, // Prevent jQuery from serializing FormData
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (result) {
            loadFieldTable();
            clearFieldFields()
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Save Field successfully",
                showConfirmButton: false,
                timer: 1500
            });
        },
        error: function (result) {
            console.log(result);
        }
    });
});
// Validate Fields
function validateField(formData) {
    const showError = (message) => {
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: message,
            showConfirmButton: false,
            timer: 1500,
        });
        console.log(message);
    };
    const requiredFields = [
        { field: formData.get("fieldImage01"), message: "Field Image 1 is required" },
        { field: formData.get("fieldImage02"), message: "Field Image 2 is required" },
        { field: formData.get("fieldCode"), message: "Field Code is required" },
        { field: formData.get("fieldName"), message: "Field Name is required" },
        { field: formData.get("fieldLocation"), message: "Field Location is required" },
        { field: formData.get("fieldSize"), message: "Field Size is required" },
    ];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i].field;
        if (!field || (typeof field === "string" && field.trim() === "")) {
            showError(requiredFields[i].message);
            return false;
        }
    }
    return true;
}

// Load Crop Codes
function loadCropCodes() {
    $.ajax({
        method: "GET",
        url: baseUrl + `crop`,
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function (result) {
            // Assuming result is an array of crop codes
            const cropDropdown = $("#field-crop-code");
            cropDropdown.empty(); // Clear existing options

            // Add an empty option for placeholder
            cropDropdown.append(`<option value="">Select a Crop Code</option>`);

            // Add crop codes as options
            result.forEach(crop => {
                console.log("crop-code", crop.cropCode);
                cropDropdown.append(`<option value="${crop.cropCode}">${crop.cropCode}</option>`);
            });
        },
        error: function () {
            Swal.fire({
                position: "top-middle",
                icon: "error",
                title: "No Crop Codes Found",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    });
}

// Load Field Table
function loadFieldTable(){
    $('#fieldTable tbody').empty();
    $.ajax({
        method:"GET",
        url:baseUrl+`fields`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        success:function(result){
            result.forEach(field => {
                $('#fieldTableBody').append(`
                    <tr data-field-id="${field.fieldCode}">                                 
                        <td>${field.fieldCode}</td>
                        <td>${field.fieldName}</td>
                        <td>${field.fieldLocation}</td>
                        <td>${field.fieldSize}</td>
                        <td>${field.crop.cropCode} </td>
                    </tr>
                `);
            });
            var fieldCount = $('#fieldTableBody tr').length;
            $('#fieldCount').text(`${fieldCount}`);
        },
        error:function(result){
            console.log(result);
        }
    });
}

function clearFieldFields(){
    $('#fieldCode').val('');
    $('#fieldName').val('');
    $('#fieldLocation').val('');
    $('#fieldSize').val('');
    $('#fieldImage01').val('');
    $('#fieldImage02').val('');
    $('#previewFieldImage01').attr('src', 'https://via.placeholder.com/200x200?text=Click+to+upload+Image+1');
    $('#previewFieldImage02').attr('src', 'https://via.placeholder.com/200x200?text=Click+to+upload+Image+2');
}
