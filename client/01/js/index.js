(function () {

    $(function () {

        var userTable = $('#userTable');

        $('#deleteButton').on('click', function () {
            var userIdList = $.map(userTable.bootstrapTable('getSelections'), function (row) {
                return row.userId;
            });
            $.ajax({
                type: 'DELETE',
                url: 'http://localhost:8888/user/',
                data: {
                    userIdList: JSON.stringify(userIdList)
                }
            }).done(function (data) {
                userTable.bootstrapTable('refresh');
            }).fail(function (data) {
                userTable.bootstrapTable('refresh');
            });
        });

        $('#addButton').on('click', function () {
            saveRowData(true);
        });

        $('#updateButton').on('click', function () {
            saveRowData(false);
        });

        $('#addModalButton').on('click', function () {
            displayEditModal(true);
        });

        userTable.bootstrapTable({
            sidePagination: 'server',
            showRefresh: true,
            sortName: 'name',
            sortOrder: 'asc',
            totalField: 'total',
            dataField: 'list',
            pagination: true,
            pageSize: 5,
            pageList: [5, 10, 25, 50, 100],
            ajax: function (params) {
                $.ajax({
                    type: 'GET',
                    url: 'http://localhost:8888/users/',
                    data: {
                        limit: params.data.limit,
                        offset: params.data.offset,
                        order: params.data.order,
                        sort: params.data.sort
                    }
                }).done(function (data) {
                    params.success(data);
                }).fail(function (data) {
                    params.error(data);
                });
            },
            columns: [
                {
                    field: 'selected',
                    checkbox: true,
                    align: 'center'
                },
                {
                    field: 'name',
                    title: 'Name',
                    sortable: true
                },
                {
                    field: 'age',
                    title: 'Age',
                    sortable: true
                },
                {
                    field: 'gender',
                    title: 'Gender',
                    sortable: true
                }
            ]
        }).on('click-row.bs.table', function (event, row, element, field) {
            if (field !== 'state') {
                displayEditModal(false, element.index(), row);
            }
        });

        function displayEditModal(isAdd, rowIndex, rowData) {
            if (isAdd) {
                $('#editModalTitile').text('Add user');
                $('#addButton').show();
                $('#updateButton').hide();
            } else {
                $('#editModalTitile').text('Update user');
                $('#addButton').hide();
                $('#updateButton').show();
                $.ajax({
                    type: 'GET',
                    url: 'http://localhost:8888/user/',
                    data: {
                        userid: rowData.userId
                    }
                }).done(function (data) {
                    $('#rowId').val(data.userId);
                    $('#name').val(data.name);
                    $('#age').val(data.age);
                    $('#gender').val(data.gender);
                }).fail(function (data) {
                });
            }
            $('#editModal').modal('show');
        }

        function saveRowData(isAdd) {
            var rowId = $('#rowId').val();
            var rowData = {
                name: $('#name').val(),
                age: $('#age').val(),
                gender: $('#gender').val()
            };
            if (isAdd) {
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:8888/user/',
                    data: rowData
                }).done(function (data) {
                    userTable.bootstrapTable('refresh');
                }).fail(function (data) {
                    userTable.bootstrapTable('refresh');
                });
            } else {
                $.ajax({
                    type: 'PUT',
                    url: 'http://localhost:8888/user/',
                    data: rowData
                }).done(function (data) {
                    userTable.bootstrapTable('refresh');
                }).fail(function (data) {
                    userTable.bootstrapTable('refresh');
                });
            }
            $('#editModal').modal('hide');
            $('#rowId').val('');
            $('#rowIndex').val('');
            $('#name').val('');
            $('#age').val('');
            $('#gender').val('male');
        }

    });

})();