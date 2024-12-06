// Load all field IDs into the dropdown for field selection
function loadAllFieldIdsInFieldStaff() {
    $('#fieldStafFieldCode').empty();
    $.ajax({
        method: "GET",
        url: baseUrl + `fields`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        success: function(result) {
            result.forEach(field => {
                $('#fieldStafFieldCode').append(
                    `<option value="${field.fieldCode}">${field.fieldCode}</option>`
                );
            });
        },
        error: function(error) {
            console.error("Error fetching field data:", error);
        }
    });
}

// Load all staff IDs into the dropdown for staff selection
function loadAllStaffIdsInFieldStaff() {
    $('#fieldStaffStaffId').empty();
    $.ajax({
        method: "GET",
        url: baseUrl + `staff`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        success: function(result) {
            result.forEach(staff => {
                $('#fieldStaffStaffId').append(
                    `<option value="${staff.staffId}">${staff.staffId}</option>`
                );
            });
        },
        error: function(error) {
            console.error("Error fetching staff data:", error);
        }
    });
}

// Save button click event handler
$('#btnSaveFieldStaff').click(function() {
    addStaffToField();
});

// Update button click event handler
$('#btnUpdateFieldStaff').click(function() {
    removeStaffFromField();
});

// Search button click event handler
$('#btnSearchFieldStaff').click(function() {
    loadStaffForField();
});

// Add staff members to a field
function addStaffToField() {
    const fieldId = $('#fieldStafFieldCode').val(); // Selected field ID
    let staffIds = $('#fieldStaffStaffId').val(); // Multi-select dropdown, might return a single value or array

    // Ensure staffIds is always an array
    if (!Array.isArray(staffIds)) {
        staffIds = [staffIds]; // If a single staff is selected, wrap it in an array
    }

    if (staffIds.length === 0) {
        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Please select at least one staff member!',
            showConfirmButton: true
        });
        return;
    }

    $.ajax({
        method: "POST",
        url: `${baseUrl}field-staff/${fieldId}`,
        data: JSON.stringify(staffIds), // Send staffIds as a JSON array
        contentType: "application/json",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        success: function() {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Staff members added to field successfully!',
                showConfirmButton: false,
                timer: 1500
            });
            clearSelections();
        },
        error: function(error) {
            console.error("Error adding staff to field:", error);
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Failed to add staff to field!',
                text: error.responseJSON?.message || "An unknown error occurred.",
                showConfirmButton: true
            });
        }
    });
}

// Clear selections
function clearSelections() {
    // Resetting the selected value for a dropdown (single select)
    $('#fieldStafFieldCode').val(''); // Reset the field selection

    // Reset the selected values for a multi-select dropdown
    $('#fieldStaffStaffId').val([]); // Reset multi-select (empty array)
}


// Remove a staff member from a field
function removeStaffFromField() {
    const fieldId = $('#fieldStafFieldCode').val(); // Selected field ID
    const staffId = $('#fieldStaffStaffId').val(); // Single-select dropdown for staff removal

    if (!staffId) {
        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Please select a staff member to remove!',
            showConfirmButton: true
        });
        return;
    }

    $.ajax({
        method: "DELETE",
        url: `${baseUrl}field-staff/${fieldId}/staff/${staffId}`, // Endpoint for removal
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        success: function() {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Staff member removed from field successfully!',
                showConfirmButton: false,
                timer: 1500
            });

            // Optionally clear the selection after successful removal
            clearSelections();
        },
        error: function(error) {
            console.error("Error removing staff from field:", error);
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Failed to remove staff from field!',
                text: error.responseJSON?.message || "An unknown error occurred.",
                showConfirmButton: true
            });
        }
    });
}

// Get all staff members associated with a field
function loadStaffForField() {
    const fieldId = $('#fieldStafFieldCode').val();
    if (!fieldId) {
        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Please select a field to load staff for!',
            showConfirmButton: true
        });
        return;
    }
    $('#fieldStaffTableBody').empty(); // Clear the existing table body

    $.ajax({
        method: "GET",
        url:  `${baseUrl}field-staff/${fieldId}`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        success: function(result) {
            if (result && result.length > 0) {
                result.forEach(staff => {
                    $('#fieldStaffTableBody').append(`
                        <tr>
                            <td>${fieldId}</td>
                            <td>${staff.staffId}</td>
                        </tr>
                    `);
                });
            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'info',
                    title: 'No staff members found for this field.',
                    showConfirmButton: true
                });
            }
        },
        error: function(error) {
            console.error("Error loading staff for field:", error);
        }
    });
}
