$(document).ready(function(){
    
    //search button
    $('#result_table').hide();
    $('#search_submit').click(function(){

        $('#result_table').hide();
        // check list
        const check_list = [];
        let anyChecked = false;
        for (let i = 0; i < 5; i++) {
            
            const selectElement = $('#stage' + i );
            if (selectElement.length > 0) {
                if (selectElement.is(':checked')) {
                    check_list.push('stage' + i);
                    console.log('stage'+ i + ' is checked.');
                    anyChecked = true;                 
                } else {
                    console.log('stage'+ i + ' is not checked.');
                }
            }
        }
        if (!anyChecked) {
            check_list.push('all'); 
        }
        console.log(check_list);
        
        

        $.ajax({
            type: 'POST',
            url: '/DEM/DEM_database_table/', 
            data: {'check_list': check_list.join(',')},
            beforeSend:function(){
                var count=0
                tID= setInterval(timedCount , 50);
                    function timedCount() {
                    count=count+0.05;
                    swal({
                        title: "Running...",
                        text: "It may take several minutes.\nPlease be patient.\n \nRunning time: "+parseInt(count)+" seconds\nClick anywhere of the page \nif the running time does not change",                       
                        button: false,
                    });
                };
            },  
                success: function(response){
                    clearInterval(tID);
                    swal.close();
                    if (response.CRC_Data_N_dict.length === 0){
                        table_html = '<p style="background-color: #265a88;color:#FFFFFF;border-color: #265a88;text-align:center;border-top-left-radius:4px;border-top-right-radius:4px;font-size: xx-large; width:100%;">CRC</p> <table id="Database_Table" class="display" style="width:100%"></table>'
                        document.getElementById('ans_table').innerHTML = table_html;
                        var tableData = response.CRC_Data_dict;
                        var columns = [];
            
                        for (var key in tableData[0]) {
                            columns.push({ data: key, title: key });
                        }
        
                        
                        $('#Database_Table').DataTable({
                                searching: true,
                                paging: true,
                                info: true,
                                scrollX: true,
                                scrollY: true,
                                data: tableData,
                                columns: columns,
                                deferRender: true, // Add deferRender option
                                destroy: true,
                                });
                    }else if (response.CRC_Data_dict.length === 0){
                            table_html = '<p style="background-color: red;color:#FFFFFF;border-color: #265a88;text-align:center;border-top-left-radius:4px;border-top-right-radius:4px;font-size: xx-large; width:100%;">Healthy</p> <table id="Database_Table_N" class="display" style="width:100%"></table>'
                            document.getElementById('ans_table').innerHTML = table_html;
                            //Healthy table        
                            var tableData_N = response.CRC_Data_N_dict;
                            var columns_N = [];
                
                            for (var key in tableData_N[0]) {
                                columns_N.push({ data: key, title: key });
                            }
            
                            
                            $('#Database_Table_N').DataTable({
                                    searching: true,
                                    paging: true,
                                    info: true,
                                    scrollX: true,
                                    scrollY: true,
                                    data: tableData_N,
                                    columns: columns_N,
                                    deferRender: true, // Add deferRender option
                                    destroy: true,
                                    });
                        }else{
                            table_html = '<p style="background-color: #265a88;color:#FFFFFF;border-color: #265a88;text-align:center;border-top-left-radius:4px;border-top-right-radius:4px;font-size: xx-large; width:100%;">CRC</p> <table id="Database_Table" class="display" style="width:100%"></table> <br> <p style="background-color: red;color:#FFFFFF;border-color: #265a88;text-align:center;border-top-left-radius:4px;border-top-right-radius:4px;font-size: xx-large; width:100%;">Healthy</p> <table id="Database_Table_N" class="display" style="width:100%"></table>'
                            document.getElementById('ans_table').innerHTML = table_html;
                            var tableData = response.CRC_Data_dict;
                            var columns = [];
                
                            for (var key in tableData[0]) {
                                columns.push({ data: key, title: key });
                            }
            
                            
                            $('#Database_Table').DataTable({
                                    searching: true,
                                    paging: true,
                                    info: true,
                                    scrollX: true,
                                    scrollY: true,
                                    data: tableData,
                                    columns: columns,
                                    deferRender: true, // Add deferRender option
                                    destroy: true,
                                    });
                            //Healthy table        
                            var tableData_N = response.CRC_Data_N_dict;
                            var columns_N = [];
                
                            for (var key in tableData_N[0]) {
                                columns_N.push({ data: key, title: key });
                            }
            
                            
                            $('#Database_Table_N').DataTable({
                                    searching: true,
                                    paging: true,
                                    info: true,
                                    scrollX: true,
                                    scrollY: true,
                                    data: tableData_N,
                                    columns: columns_N,
                                    deferRender: true, // Add deferRender option
                                    destroy: true,
                                    });
                        }
                   
                
                    $('#result_table').show();
                    swal.close();

                },
                error: function(e, xhr){
                    clearInterval(tID);
                    swal.close();
                    swal('error')
                    // alert('Something error');
                }
            });

    });
});

function toggleAll(source) {
    var checkboxes = document.querySelectorAll('input[name="foo"]');
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = source.checked;
    }
};
