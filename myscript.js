/*Requirements
1. On click of 'Filter' button, adds a row of inputs fields with just two fields showing as long as all 'Filter by' options hasn't been selected by user already in previous row(s)
2. A new row cannot be added if any of the required fields in the previous row is empty
3. Selected 'Filter by' option determines which list of options get populated in the 'Conditions' field
4. Selected 'Filter by' option determines the type of the third input field to show to user
5.In adding a new row, the users selection in the previous row shouldn't be affected and all three input fields should display to the user
6.A new row's 'Filter by' option list shouldn't contain what has been selected already/should be disabled.*/

//


/*New Implementation*/

$(document).ready(function () {

    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": true,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }

    var filterBy = [
        { id: 1, filter: 'Employee ID' },
        { id: 2, filter: 'Employee Type' },
        { id: 3, filter: 'Salary Grade' },
        { id: 4, filter: 'Division' },
        { id: 5, filter: 'Department' }
    ];

    var conditions = [
        { id: 1, condition: 'EQUAL TO' },
        { id: 2, condition: 'NOT EQUAL TO' },
        { id: 3, condition: 'LIKE' },
        { id: 4, condition: 'NOT LIKE' },
        { id: 5, condition: 'IN' }
    ];

    var newConditions = [
        { id: 3, condition: 'LIKE' },
        { id: 4, condition: 'NOT LIKE' },
        { id: 5, condition: 'IN' }
    ];

    var selectedFilterBy = [];

    var selectedFilterObj = { id: '', filter: '' };

    var selectedFilterText = "", selectedFilterValue, options;

    var rowCount = 0;

    $('#btnFilter').on('click', function (event) {

        ++rowCount;

        var selectedFilterValue = $(".row")
            .find(".filterBy")
            .last()
            .find("option:selected")
            .val() || null;

        if (selectedFilterValue) {
            selectedFilterBy.push(selectedFilterValue);
        }

        console.log(selectedFilterBy);

        var filterOpToDel;

        if (filterBy.length > 0) {


            if ($('#parentBody').parsley().validate() === true) {

                $("#parentBody").append(`<div class="row p-b-5">
                                    <div class="col-md-12 bg-silver-lighter p-t-10 p-b-10">
                                        <div class="form-group">
                                            <div class="col-md-3 filterByCol">
                                                <label class="control-label">Filter By</label>
                                                <select class="form-control input-sm filterBy" id="filterId-${rowCount}"  required></select>
                                            </div>
                                            <div class="col-md-2 conditionCol">
                                                <label class="control-label">Condition</label>
                                                <select class="form-control input-sm conditions" required></select>
                                            </div>
                                            <div class="col-md-3 txtInputCol" hidden>
                                                <label class="control-label lblValue">Value</label>
                                            </div>
                                            <div class="col-md-1 p-t-25">
                                                <span class="btn btn-circle btn-xs btn-danger btnRemove"><i class="fa fa-close"></i></span>
                                            </div>
                                        </div>
                                    </div>
                            </div>`);

                $(`#filterId-${rowCount}`)
                    .find("option")
                    .remove();

                var filterOptions = '<option selected disabled value="">Select a filter </option>';

                filterOptions = filterBy.reduce(function (htmlString, filterItem) {
                    if (selectedFilterBy.includes(filterItem.id.toString())) {
                        return `${htmlString}<option disabled id="filter-option-${filterItem.id}" value="${filterItem.id}">${filterItem.filter}</option>`
                    }

                    return `${htmlString}<option id="filter-option-${filterItem.id}" value="${filterItem.id}">${filterItem.filter}</option>`

                }, filterOptions)

                $(`#filterId-${rowCount}`).append(filterOptions);

            }
        } else {
            event.preventDefault();
            toastr["warning"]("Filter options exhausted!", "Message");
        }
    });

    $(document).on('change', `.filterBy`, function () {

        var selectedFilterInput1 = $(this).find('option:selected').text();

        $(this).parent().next('.conditionCol').children('.conditions').find('option').remove();

        if ((selectedFilterInput1.toLowerCase()) != 'employee id') {
            alert(selectedFilterInput1.toLowerCase());
            alert(`Its not Employee Id`);
            options = '<option selected disabled value="">Select a condition </option>';

            $(newConditions).each(function (_, elem) {
                options += `<option value="${elem.id}"> ${elem.condition} </option>`;
            })

            $(this).parent().next('.conditionCol').children('.conditions').append(options);

        } else {
            options = '<option selected disabled value="-1">Select a condition </option>';

            $(conditions).each(function (_, elem) {
                options += `<option value="${elem.id}">${elem.condition}</option>`;
            })

            $(this).parent().next('.conditionCol').children('.conditions').append(options);
        }

    });



    $(document).on('change', '.conditions', function () {
        selectedFilterText = $(this).parent().prev().children('.filterBy').find('option:selected').text();

        $(this)
            .parent()
            .next(".txtInputCol")
            .children()
            .not("label")
            .remove();

        if (selectedFilterText.toLowerCase() != "employee id") {
            $(this)
                .parent()
                .next('.txtInputCol').show().append(`<select class="multiple-select2 form-control" multiple="multiple">
                                                    <optgroup label="Alaskan/Hawaiian Time Zone">
                                                        <option value="AK">Alaska</option>
                                                        <option value="HI">Hawaii</option>
                                                    </optgroup>
                                                    <optgroup label="Pacific Time Zone">
                                                        <option value="CA">California</option>
                                                        <option value="NV">Nevada</option>
                                                        <option value="OR">Oregon</option>
                                                        <option value="WA">Washington</option>
                                                    </optgroup>
                                                    <optgroup label="Mountain Time Zone">
                                                        <option value="AZ">Arizona</option>
                                                        <option value="CO">Colorado</option>
                                                        <option value="ID">Idaho</option>
                                                        <option value="MT">Montana</option>
                                                        <option value="NE">Nebraska</option>
                                                        <option value="NM">New Mexico</option>
                                                        <option value="ND">North Dakota</option>
                                                        <option value="UT">Utah</option>
                                                        <option value="WY">Wyoming</option>
                                                    </optgroup>
                                                </select>`);
            $(".multiple-select2").select2({
                placeholder: "Select a state"
            });
            $(".multiple-select2").prop("required", true);
        } else {
            $(this)
                .parent()
                .next('.txtInputCol').show().append(`<input class="form-control input-sm txtInputVal" type="text" />`);
            $(".txtInputVal").prop("required", true);
        }

    });

    $(document).on('click', '.btnRemove', function () {
        $(this).closest('.row').remove();
    });

});
