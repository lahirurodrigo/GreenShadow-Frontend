$("#btnSignIn").on('click' , function () {
    var email = $('#signInEmail').val();
    var password = $('#signInPassword').val();

    console.log(email);
    console.log(password);

    const formData ={
        email:email,
        password:password
    }

    console.log(formData);

    var url = "http://localhost:5050/greenshadow/api/v1/auth/signIn";

    console.log(url);

    if(validate(email,password)){
        $.ajax({
            method:"POST",
            url:url,
            contentType:"application/json",
            data:JSON.stringify(formData),
            success:function(response){
                console.log(response.token);
                document.cookie = "token= "+response.token;
                grantPermission(email)
                navigatePageSideBar("#dashBoardPage");
            },error:function(token){
                console.log(token)
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Invalid User Name or Password",
                    showConfirmButton: false,
                    timer: 1500
                });
                navigateSignInUpPage("#signInPage");
            }
        })
    } else {
        navigateSignInUpPage("#signInPage");
    }

    function validate(email, password) {
        if(email == "" || password == ""){
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "email name and password required",
                showConfirmButton: false,
                timer: 1500
            });
            return false;
        }
        return true;
    }
});

function grantPermission(email) {
    getUserByEmail(email)
        .then(role => {  // Get the role after the promise resolves
            if (role === "MANAGER") {
                console.log("Manager");
            } else if (role === "SCIENTIST") {
                console.log("Scientist");
            } else if (role === "ADMINISTRATIVE") {
                console.log("Administrative");
            } else {
                console.log(role);
                console.log("Employee");
            }

            // Call restrictNavigationLinks with the user's role
            restrictNavigationLinks(role);
        })
        .catch(error => {
            console.log("Error fetching user data:", error);
        });
}

// Function to restrict navigation links based on user role
function restrictNavigationLinks(userRole) {
    // Define restricted links for specific roles
    const restrictedLinks = {
        MANAGER: [], // Links restricted for 'viewer'
        SCIENTIST: ["#usersNav", "#staffsNav", "#fieldStaffNav", "#equipmentsNav", "#vehiclesNav"], // Links restricted for 'staff'
        ADMINISTRATIVE: ["#cropsNav", "#fieldsNav", "#monitoringLogsNav"], // Links restricted for 'admin'
        EMPLOYEE: ["#usersNav", "#staffsNav", "#fieldStaffNav", "#equipmentsNav", "#vehiclesNav","#cropsNav", "#fieldsNav", "#monitoringLogsNav"], // Links restricted for 'admin'
    };

    // Get the list of restricted links for the current role
    const linksToDisable = restrictedLinks[userRole] || [];

    // Disable the restricted links
    linksToDisable.forEach((linkId) => {
        $(linkId).addClass("disabled").on("click", function (e) {
            e.preventDefault(); // Prevent navigation
            Swal.fire({
                icon: "warning",
                title: "Access Denied",
                text: "You do not have permission to access this section.",
                showConfirmButton: true,
            });
        });
    });
}

function getUserByEmail(email) {
    return new Promise((resolve, reject) => {
        const url = baseUrl + `auth/${email}`;

        $.ajax({
            method: "GET",
            url: url,
            headers: {
                'Authorization': `Bearer ${token}` // Include the token if the endpoint is secured
            },
            success: function(user) {
                if (user && user.role) {
                    resolve(user.role); // Resolve the Promise with the role
                } else {
                    reject("Role not found for the user.");
                }
            },
            error: function(error) {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Failed to fetch user data!",
                    text: error.responseJSON?.message || "An unknown error occurred.",
                    showConfirmButton: true
                });
                reject(error); // Reject the Promise if the request fails
            }
        });
    });
}




