$(document).ready(function(){

    $('#RF_result_block').hide();
    $('#RF_submit').click(function() {
        // // 檢查 B12 開關狀態
        // var B12_checked = $('#toggle-B12').prop('checked');
        // // 檢查 B123 開關狀態
        // var B123_checked = $('#toggle-B123').prop('checked');
        // var table_list = [];
        // if (B12_checked === true){
        //     table_list.push("B12");
        // }else if (B123_checked === true){
        //     table_list.push("B123");
        // }
        // console.log('table list', table_list)
        // 檢查 Total Count 開關狀態
        var total_count_checked = $('#toggle-total').prop('checked');
        var select_count = document.getElementById('total_count');
        var select_count_Value = total_count_checked ? select_count.value : 9999;

        var select_count_condition = document.getElementById('total_count_condition');
        var select_count_condition_Value = total_count_checked ? select_count_condition.value : 8888;
        // 檢查 Mean Importance 開關狀態
        var importance_checked = $('#toggle-importance').prop('checked');
        var select_importance = document.getElementById('mean_importance');
        var select_importance_Value = importance_checked ? select_importance.value : 9999;
        var select_importance_condition = document.getElementById('mean_importance_condition');
        var select_importance_condition_Value = importance_checked ? select_importance_condition.value : 8888;
        // 檢查 AUC Value 開關狀態
        var auc_checked = $('#toggle-auc').prop('checked');
        var select_auc = document.getElementById('auc_value');
        var select_auc_Value = auc_checked ? select_auc.value : 9999;
        var select_auc_condition = document.getElementById('auc_value_condition');
        var select_auc_condition_Value = auc_checked ? select_auc_condition.value : 8888;
        // // 檢查 p value 開關狀態
        // var pvalue_checked = $('#toggle-pvalue').prop('checked');
        // var select_pvalue = document.getElementById('pvalue_value');
        // var select_pvalue_Value = pvalue_checked ? select_pvalue.value : 9999;
        // var select_pvalue_condition = document.gEetlementById('pvalue_value_condition');
        // var select_pvalue_condition_Value = pvalue_checked ? select_pvalue_condition.value : 8888;
        console.log(select_count_Value);
        console.log(select_importance_Value);
        console.log(select_auc_Value);
        console.log(select_count_condition_Value);
        console.log(select_importance_condition_Value);
        // console.log(select_auc_condition_Value);
        //至少選一個按鈕
        if (!total_count_checked && !importance_checked && !auc_checked ) {
            alert("Please select at least one condition");
            return; 
        }

        $.ajax({
            type: 'POST',
            url: '/DEM/RF_Model_screener_table/', 
            data: {'select_count_Value':select_count_Value,'select_importance_Value':select_importance_Value,'select_auc_Value':select_auc_Value ,'select_count_condition_Value':select_count_condition_Value, 'select_importance_condition_Value':select_importance_condition_Value,'select_auc_condition_Value':select_auc_condition_Value },
            // beforeSend:function(){
            //     var count=0
            //     tID= setInterval(timedCount , 50);
            //         function timedCount() {
            //         count=count+0.05;
            //         swal({
            //             title: "Running...",
            //             text: "It may take several minutes.\nPlease be patient.\n \nRunning time: "+parseInt(count)+" seconds\nClick anywhere of the page \nif the running time does not change",                       
            //             button: false,
            //         });
            //     };
            // },  
            success: function(response){
                console.log('sucess')
                // clearInterval(tID);
                // swal.close();
                // table_html = '<table id="RF_result_Table" class="display" style="width:100%"></table>'
                // document.getElementById('ans_table').innerHTML = table_html;
                var tableData = response.Table_Data_dict;
                $('#RF_result_Table').DataTable({
                        searching: true,
                        paging: true,
                        info: true,
                        // scrollX: true,
                        // scrollY: true,
                        data: tableData,
                        columns: [
                            { data: 'Metabolite', title: "Metabolite" },
                            { data: 'Total_Count', title: "Total Count" },
                            { data: 'Mean_Importance', title:"Mean Importance"},
                            { data: 'Metabolite_AUC', title:"AUC"},
                            // { data: 'p_value', title:"P Value (T Test)"},
                            { data: 'Metabolite name', title: "Metabolite name" },
                            // { data: 'Patient_CRC', title: 'CRC Patient' },
                            // { data: 'Patient_Healthy', title: 'Healthy Patient'},
                            // { data: 'fold_change(CRC/Healthy)', title: 'Fold change(CRC/Healthy)'},
                            // { data: 'U_test', title: 'U test'},
                            // { data: 'T_test', title: 'T test'},
                            // { data: 'KS_test', title: 'KS test'},
                            // {
                            //     data: null,
                            //     title: "Show Heatmap",
                            //     render: function (data, type, row) {
                            //         if (type === 'display') {
                            //             return '<button type="button" class="btn btn-success Heatmap-btn" data-toggle="modal" data-target="#Heatmap"> Heatmap </button>';
                            //         } else {
                            //             return data;
                            //         }
                            //     }
                            // },
                        ],
                        // rowCallback: function (row, data) {
                        //     $(row).find('.Heatmap-btn').on('click', function () {
        
                        //         $.ajax({
                        //             url: '', 
                        //             type: 'POST', 
                        //             data:  data ,
                        //             dataType : 'json',
                        //             success: function (response) {
                                    
                        //             },
                        //             error: function (error) {
                        //                 console.error('Untrack Error:', error);
                        //             }
                                    
                        //         });
                                
                        //     });
                        // },
                        columnDefs: [
                            { targets: '_all', className: 'text-center' }  
                          ],
                        deferRender: true, 
                        destroy: true,
                        });
                $('#RF_result_block').show();
            },
            error: function(xhr, status, error){
                // clearInterval(tID);
                // swal.close();
                // swal('error')
                // alert('Something error');
                console.log('Error:', error);  // 使用 console.log 印出錯誤訊息到開發者工具的控制台
                alert('Error: ' + error);
            },
        });
    });

})