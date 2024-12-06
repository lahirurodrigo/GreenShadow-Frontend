function loadCropCodes() {
    $.ajax({
        method: "GET",
        url: baseUrl + `crop`,
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function (result) {
            // Assuming result is an array of crop codes
            const cropDropdown = $("#cropCodeDropdown");
            cropDropdown.empty(); // Clear existing options

            // Add an empty option for placeholder
            cropDropdown.append(`<option value="">Select a Crop Code</option>`);

            // Add crop codes as options
            result.forEach(crop => {
                console.log(crop.cropCode);
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
