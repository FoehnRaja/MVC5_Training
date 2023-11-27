//pure Scripts
showInPopup = (url, title) => {
    $.ajax({
        type: "GET",
        url: url,
        succcess: function (res) {
            $("#form-modal .modal-body").html(res);
            $("#form-modal .modal-title").html(title);
            $("#form-modal").modal("show");

        }
    })
}

//display of List in Unsaved
info = []
function infoList() {
    let elem = "";
    let salaryOutput = calculateSum(info, 'Salary');

    info.map(i => (
        elem += `<tr>
                     <td>${i.Id}</td>
                    <td>${i.FirstName}</td>
                    <td>${i.LastName}</td>
                    <td>${i.Age}</td>
                    <td>${i.Salary}</td>
                    <td>
                        <button class="btn btn-primary" onclick="editButton(${i.Id})">Update</button>
                        <button class="btn btn-danger" onclick="deleteButton(${i.Id})">Delete</button>
                    </td>
                </tr>`
    ));
    document.getElementById("infoTable").innerHTML = elem;
    document.getElementById("totalSalary").innerHTML = salaryOutput;

    if (info.length == null) {
        document.getElementById("totalEmployee").innerHTML = 0;
    } else {
        document.getElementById("totalEmployee").innerHTML = info.length;
    }

}

function createInfo() {
    var formData = $('#createForm').serialize()
    let id;
    if (info.length < 1 || info.length == undefined) {
        id = 1;
    }
    else {
        id = info.length + 1;
    }
    let Id = id;

    let FirstName = document.getElementById("firstName").value;
    let LastName = document.getElementById("lastName").value;
    let Age = document.getElementById("age").value;
    let Salary = parseInt(document.getElementById("salary").value);
    if (FirstName == "" || FirstName == null || LastName == "" || LastName == null || isNaN(Age) || isNaN(Salary)) {
        toastr.warning("Please Fill out all Fields");
    }
    else {
        toastr.success("Information Added");
        let newInfo = { Id, FirstName, LastName, Age, Salary }

        info.push(newInfo);
        infoList();
        document.getElementById("createForm").reset();

        $('#createModal').modal('hide');

    }

}

function editButton(Id) {



    let updateObj = info.find(f => f.Id === Id);


    document.getElementById("eId").value = updateObj.Id;
    document.getElementById("eFirstName").value = updateObj.FirstName;
    document.getElementById("eLastName").value = updateObj.LastName;
    document.getElementById("eAge").value = updateObj.Age;
    document.getElementById("eSalary").value = updateObj.Salary;

    $('#editModal').modal('show');

}

function updateInfo() {

    let Id = parseInt(document.getElementById("eId").value);

    let FirstName = document.getElementById("eFirstName").value;
    let LastName = document.getElementById("eLastName").value;
    let Age = document.getElementById("eAge").value;
    let Salary = parseInt(document.getElementById("eSalary").value);

    let updatedInfo = { Id, FirstName, LastName, Age, Salary }


    let index = info.findIndex(f => f.Id === Id);
    info[index] = updatedInfo;

    infoList();
    document.getElementById("editForm").reset();

    $('#editModal').modal('hide');

}

function deleteButton(Id) {
    let newInfo = info.filter(f => f.Id !== Id);
    info = newInfo;
    infoList();
}

function calculateSum(array, property) {
    const total = array.reduce((accumulator, object) => {
        return accumulator + object[property];
    }, 0);

    return total;
}


$(document).ready(function () {
    $('#createModalButton').on('click', function () {
        showCreate();
    });
})

function showCreate() {

    /* $('#createContent').html(data);*/
    $('#createModal').modal('show');
}


$(document).ready(function () {
    // Call the function to load the initial employee list
    loadEmployeeList();

    // Call the functions to update the total saved salary and count


})

//Ajax
function submitAll() {
    if (info.length !== 0) {
        for (let x = 0; x < info.length; x++) {
            $.ajax({
                type: "POST",
                url: "/Information/Create",
                data: JSON.stringify({
                    FirstName: info[x].FirstName,

                    LastName: info[x].LastName,
                    Age: info[x].Age,
                    Salary: info[x].Salary
                }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {

                    loadEmployeeList();

                }

            });
        }
        info = [];
        infoList();
    } else {
        alert("You need to create some employees");
    }
}


function loadEmployeeList() {
    $.ajax({
        type: "GET",
        url: "/Information/Display",
        dataType: 'json',
        success: function (data) {



            var elements = "";
            $.each(data, function (index, item) {

                elements += `<tr>
                            <td>${item.Id}</td>
                            <td>${item.FirstName}</td>
                            <td>${item.LastName}</td>
                            <td>${item.Age}</td>
                            <td>${item.Salary}</td>
                            <td>
                                <button class="btn btn-primary" onclick="EditInSave(${item.Id})">Edit</button>
                                <button class="btn btn-danger" onclick="savedDeleteButton(${item.Id})">Delete</button>
                            </td>
                        </tr>`
                //sample use case: item.COL_HEADER 
            });
            document.getElementById("savedInfoTable").innerHTML = elements;
            updateSavedTotalSalary();
            updateSavedTotalCount();
        }

    });

}

function EditInSave(Id) {
    $.ajax({
        type: "GET",
        url: "/Information/Edit",
        dataType: 'json',
        data: { Id: Id },
        success: function (data) {
            document.getElementById("SavedEditId").value = data.Id
            document.getElementById("SavedEditFirstName").value = data.FirstName;
           
            document.getElementById("SavedEditLastName").value = data.LastName;
            parseInt(document.getElementById("SavedEditAge").value = data.Age);
            parseInt(document.getElementById("SavedEditSalary").value = data.Salary);
            $('#EditSaveModal').modal('show');

        }
    });

}

function submitEdit() {
    var formData = $('#EditNewForm').serialize();
    var savedEditId = $('#SavedEditId').val();
    var savedEditFirstName = $('#SavedEditFirstName').val();
    var savedEditLastName = $('#SavedEditLastName').val();
    var savedEditAge = $('#SavedEditAge').val();
    var savedEditSalary = $('#SavedEditSalary').val();

    var data = {
        Id: savedEditId,
        FirstName: savedEditFirstName,
        LastName: savedEditLastName,
        Age: savedEditAge,
        Salary: savedEditSalary
    };

    $.ajax({
        type: "POST",
        url: "/Information/Update",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {  // Fix the typo here
            console.log("success");
            $('#EditSaveModal').modal('hide');
            loadEmployeeList();
        },
        error: function (response) {
            console.log("error");
        },
    });
}

function updateSavedTotalSalary() {
    $.ajax({
        type: "GET",
        url: "/Information/GetTotalSalary",
        data: 'json',
        success: function (data) {
            $('#savedTotalSalary').text(data);
        }


    })
}

function updateSavedTotalCount() {
    $.ajax({
        type: "GET",
        url: "/Information/GetTotalLength",
        data: 'json',
 
        success: function (data) {
            $('#savedTotalEmployee').text(data);
        }


    })
}

function savedDeleteButton(Id) {
    $.ajax({
        type: "POST",
        url: "/Information/Delete",
        dataType: 'json',
        data: {Id:Id},
        success: function (data) {
            loadEmployeeList();
        }

    })
}

