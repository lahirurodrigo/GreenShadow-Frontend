// Save Staff
$('#btn-staff-save').on('click', () => {

    const staffData = {
        staffId: $('#staffId').val(),
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        designation: $('#designation').val(),
        gender: $('#gender').val(),
        role: $('#StaffRole').val(),
        joinDate: $('#joinDate').val(),
        dob: $('#dateOfBirth').val(),
        contactNo: $('#contactNo').val(),
        email: $('#email').val(),
        address01: $('#address01').val(),
        address02: $('#address02').val(),
        address03: $('#address03').val(),
        address04: $('#address04').val(),
        address05: $('#address05').val()
    };

    console.log(staffData);

    if (!validateStaff(staffData)) {
        return;
    }

    $.ajax({
        method: "POST",
        url: baseUrl + `staff`,
        data: JSON.stringify(staffData),  // Send the data as JSON
        contentType: "application/json",  // Set content type to JSON
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (result) {
            clearStaffFields();
            loadStaffTable();
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Staff saved successfully",
                showConfirmButton: false,
                timer: 1500
            });
        },
        error: function (result) {
            Swal.fire({
                position: "top-middle",
                icon: "error",
                title: "Staff not saved",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    });
});

// Delete staff
$('#btn-staff-delete').on('click', function () {
    var staffId = $('#staffId').val();

    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to undo this action!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                method: "DELETE",
                url: baseUrl + `staff/${staffId}`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                success: function(response) {
                    console.log("Staff deleted successfully:", response);
                    $(`tr[data-staff-id='${staffId}']`).remove();
                    clearStaffFields();
                    loadStaffTable();
                    Swal.fire(
                        'Deleted!',
                        'The staff member has been deleted.',
                        'success'
                    );
                },
                error: function(error) {
                    console.error("Error deleting staff:", error);
                    Swal.fire(
                        'Error!',
                        'There was an issue deleting the staff.',
                        'error'
                    );
                }
            });
        } else {
            console.log("Deletion cancelled by user.");
        }
    });
});

// Search staff
$('#btn-staff-search').on('click', function () {

    var staffId = $('#staffId').val();

    $.ajax({
        method: "GET",
        url: baseUrl + `staff/${staffId}`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        success: function (staff) {
            $('#staffId').val(staff.staffId);
            $('#firstName').val(staff.firstName);
            $('#lastName').val(staff.lastName);
            $('#designation').val(staff.designation);
            $('#gender').val(staff.gender);
            $('#StaffRole').val(staff.role);
            $('#joinDate').val(formatDate(staff.joinDate));
            $('#dateOfBirth').val(formatDate(staff.dob));
            $('#contactNo').val(staff.contactNo);
            $('#email').val(staff.email);
            $('#address01').val(staff.address01);
            $('#address02').val(staff.address02);
            $('#address03').val(staff.address03);
            $('#address04').val(staff.address04);
            $('#address05').val(staff.address05);
        },
        error: function (error) {
            console.error("Error fetching Staff data:", error);
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Error fetching Staff data:", error,
                showConfirmButton: false,
                timer: 1500,
            });
        }
    });

});

// Update staff

$('#btn-staff-update').on('click' ,()=>{
    console.log("click update button")
    const staffData = {
        staffId: $('#staffId').val(),
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        designation: $('#designation').val(),
        gender: $('#gender').val(),
        role: $('#StaffRole').val(),
        joinDate: $('#joinDate').val(),
        dob: $('#dateOfBirth').val(),
        contactNo: $('#contactNo').val(),
        email: $('#email').val(),
        address01: $('#address01').val(),
        address02: $('#address02').val(),
        address03: $('#address03').val(),
        address04: $('#address04').val(),
        address05: $('#address05').val()
    };
    console.log(staffData);
    if (!validateStaff(staffData)) {
        return;
    }
    var staffId = $('#staffId').val();
    $.ajax({
        method: "PUT",
        url: baseUrl + `staff/${staffId}`,
        data: JSON.stringify(staffData),  // Send the data as JSON
        contentType: "application/json",  // Set content type to JSON
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (result) {
            clearStaffFields();
            loadStaffTable();
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Staff Update successfully",
                showConfirmButton: false,
                timer: 1500
            });
        },
        error: function (result) {
            console.log(result);  // Log any errors for debugging
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Error Staff data:", result,
                showConfirmButton: false,
                timer: 1500,
            });
        }
    });
});

// Clear Fields of Staff Form

function clearStaffFields() {
    $('#staffId').val('');
    $('#firstName').val('');
    $('#lastName').val('');
    $('#designation').val('');
    $('#gender').val('MALE');
    $('#StaffRole').val('EMPLOYEE');
    $('#joinDate').val('');
    $('#dateOfBirth').val('');
    $('#contactNo').val('');
    $('#email').val('');
    $('#address01').val('');
    $('#address02').val('');
    $('#address03').val('');
    $('#address04').val('');
    $('#address05').val('');
}

// Validate Staff Data

function validateStaff(staffData) {
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
        { field: staffData.staffId, message: "Staff ID is required" },
        { field: staffData.firstName, message: "First Name is required" },
        { field: staffData.lastName, message: "Last Name is required" },
        { field: staffData.designation, message: "Designation is required" },
        { field: staffData.gender, message: "Gender is required" },
        { field: staffData.role, message: "Role is required" },
        { field: staffData.joinDate, message: "Join Date is required" },
        { field: staffData.dob, message: "Date of Birth is required" },
        { field: staffData.contactNo, message: "Contact Number is required" },
        { field: staffData.email, message: "Email is required" },
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

// Load Staff Table
function loadStaffTable() {
    $('#StaffTableBody').empty();
    $.ajax({
        method: "GET",
        url: baseUrl + `staff`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        success: function (result) {
            result.forEach(staff => {
                $('#StaffTableBody').append(`
                    <tr data-staff-id="${staff.staffId}">
                        <td>${staff.staffId}</td>
                        <td>${staff.firstName}</td>
                        <td>${staff.designation}</td>
                        <td>${staff.contactNo}</td>
                        <td>${staff.email}</td>
                    </tr>
                `);
            });
            var staffMemberCount = $('#StaffTableBody tr').length;
            $('#staffCount').text(`${staffMemberCount}`);
        },
        error: function (result) {
            console.log(result);
        }
    });
}