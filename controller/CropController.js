// Save Crop
$("#btn-crop-save").on('click', function ()  {

    console.log(token)

    console.log("Clicked")
    var cropCode = $("#cropCode").val();
    var cropCommonName = $("#cropCommonName").val();
    var cropScientificName = $("#cropScientificName").val();
    var category = $("#cropCategory").val();
    var season = $("#cropSeason").val();
    var cropImage = $('#cropImage')[0].files[0];

    const formData = new FormData();
    formData.append("cropCode", cropCode);
    formData.append("cropCommonName", cropCommonName);
    formData.append("cropScientificName", cropScientificName);
    formData.append("cropCategory", category);
    formData.append("cropSeason", season);
    formData.append("cropImage", cropImage);

    $.ajax({
        method: "POST",
        url: baseUrl + `crop`,
        contentType: false,
        processData: false,
        data: formData,
        headers: {
            "Authorization": "Bearer " + token
        },
        success: (data) => {
            swal.fire({
                position: "top-middle",
                icon: "success",
                title: "Crop saved successfully",
                showConfirmButton: false,
                timer: 1500,
            });
        },
        error: (error) => {
            swal.fire({
                position: "top-middle",
                icon: "error",
                title: "Crop not saved",
                showConfirmButton: false,
                timer: 1500,
            });
        },
    });
    clearCropFields();
});


// Delete Crop
$("#btn-crop-delete").on('click', function ()  {
    var cropCode = $("#cropCode").val();

    $.ajax({
        method: "DELETE",
        url: baseUrl + `crop/${cropCode}`,
        headers: {
            "Authorization": "Bearer " + token
        },
        success: (data) => {
            swal.fire({
                position: "top-middle",
                icon: "success",
                title: "Crop deleted successfully",
                showConfirmButton: false,
                timer: 1500,
            });
        },
        error: (error) => {
            swal.fire({
                position: "top-middle",
                icon: "error",
                title: "Crop not deleted",
                showConfirmButton: false,
                timer: 1500,
            });
        },
    });
});


// Update Crop
$("#btn-crop-update").on('click', function ()  {

    console.log(token)

    console.log("Clicked")
    var code = $("#cropCode").val();
    var cropCommonName = $("#cropCommonName").val();
    var cropScientificName = $("#cropScientificName").val();
    var category = $("#cropCategory").val();
    var season = $("#cropSeason").val();
    var cropImage = $('#cropImage')[0].files[0];

    const formData = new FormData();
    formData.append("cropCommonName", cropCommonName);
    formData.append("cropScientificName", cropScientificName);
    formData.append("cropCategory", category);
    formData.append("cropSeason", season);
    formData.append("cropImage", cropImage);

    $.ajax({
        method: "PUT",
        url: baseUrl + `crop/${code}`,
        contentType: false,
        processData: false,
        data: formData,
        headers: {
            "Authorization": "Bearer " + token
        },
        success: (data) => {
            swal.fire({
                position: "top-middle",
                icon: "success",
                title: "Crop saved successfully",
                showConfirmButton: false,
                timer: 1500,
            });
        },
        error: (error) => {
            swal.fire({
                position: "top-middle",
                icon: "error",
                title: "Crop not saved",
                showConfirmButton: false,
                timer: 1500,
            });
        },
    });
});

// Get Crop Data
$("#btn-crop-search-by-commonName").on('click', function ()  {
    var category = $("#search-by-cropCommonName").val();

    $('#CropTableBody').empty();

    $.ajax({
        method: "GET",
        url: baseUrl + "crop/category",
        data: { category: category },
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function (result) {
            result.forEach(crop => {
                $('#CropTableBody').append(`
                    <tr data-crop-code="${crop.cropCode}">
                        <td>${crop.cropCode}</td>
                        <td>${crop.cropCommonName}</td>
                        <td>${crop.cropScientificName}</td>
                        <td>${crop.cropCategory}</td>
                        <td>${crop.cropSeason}</td>           
                    </tr>
                `);
            });
        },
        error: function (result) {
           swlert.fire({
                position: "top-middle",
                icon: "error",
                title: "No Such Category",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    });
});

// Get specific Crop Data and Display in Table
function loadCropTable() {
    $('#CropTableBody').empty();
    $.ajax({
        method: "GET",
        url: baseUrl + `crop`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        success: function (result) {
            result.forEach(crop => {
                $('#CropTableBody').append(`
                    <tr data-crop-code="${crop.cropCode}">
                        <td>${crop.cropCode}</td>
                        <td>${crop.cropCommonName}</td>
                        <td>${crop.cropScientificName}</td>
                        <td>${crop.cropCategory}</td>
                        <td>${crop.cropSeason}</td>           
                    </tr>
                `);
            });
        },
        error: function (result) {
            console.log(result);
        }
    });
}



// Get all Crop Data and Display in Table
function loadCropTable() {
    $('#CropTableBody').empty();
    $.ajax({
        method: "GET",
        url: baseUrl + `crop`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        success: function (result) {
            result.forEach(crop => {
                $('#CropTableBody').append(`
                    <tr data-crop-code="${crop.cropCode}">
                        <td>${crop.cropCode}</td>
                        <td>${crop.cropCommonName}</td>
                        <td>${crop.cropScientificName}</td>
                        <td>${crop.cropCategory}</td>
                        <td>${crop.cropSeason}</td>           
                    </tr>
                `);
            });
        },
        error: function (result) {
            console.log(result);
        }
    });
}

// To filter Crop table
function searchCrops() {
    console.log("1111111111111")
    // Get the search query
    var searchQuery = $('#searchCrop').val().toLowerCase();
    // Iterate through each row in the crop table body
    $('#cropTable tbody tr').each(function() {
        var row = $(this);
        // Get the text content of each cell in the row
        var cropCode = row.find('td').eq(0).text().toLowerCase();
        var commonName = row.find('td').eq(1).text().toLowerCase();
        var scientificName = row.find('td').eq(2).text().toLowerCase();
        var category = row.find('td').eq(3).text().toLowerCase();
        var season = row.find('td').eq(4).text().toLowerCase();
        // Check if the search query matches any cell content
        if (cropCode.includes(searchQuery) || commonName.includes(searchQuery) || scientificName.includes(searchQuery)
            || category.includes(searchQuery) || category.includes(searchQuery)) {
            row.show(); // Show the row if it matches
        } else {
            row.hide(); // Hide the row if it doesn't match
        }
    });
}


function clearCropFields() {
    $('#cropCode').val("");
    $('#cropCommonName').val("");
    $('#cropScientificName').val("");
    $('#cropCategory').val("");
    $('#cropSeason').val("");
    $('#cropFieldCode').val("");
    $('#cropImage01').val("");
    $('#previewCropImage01').attr("src", "https://via.placeholder.com/200x200?text=Click+to+upload+Image+1");
}

