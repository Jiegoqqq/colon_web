$(document).ready(function(){

    $('#RF_result_block').hide();
    $('#RF_submit').click(function() {
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

        console.log(select_count_Value);
        console.log(select_importance_Value);
        console.log(select_auc_Value);
        console.log(select_count_condition_Value);
        console.log(select_importance_condition_Value);
        console.log(select_auc_condition_Value);

        //統計測試
        var check_list = [];
        // 檢查 foldchange_checkbox 的狀態
        var foldisChecked = $('#foldchange_checkbox').prop('checked');
        if (foldisChecked) {
            console.log("Fold change Checkbox is checked.");
            check_list.push("foldchange");
        }

        // 檢查 test_checkbox 的狀態
        var testisChecked = $('#test_checkbox').prop('checked');
        if (testisChecked) {
            console.log("Test Checkbox is checked.");
            check_list.push("test");
        }
        $('#result_table').hide();
        // 获取输入值

        var FC_select = document.getElementById('FC_select');
        var FC_select_Condition = FC_select.value;
        var log2FC_Condition = document.getElementById('log2FC_input');
        var log2FC_Condition_value= log2FC_Condition.value;
        var TEST_select = document.getElementById('TEST_select');
        var TEST_select_Value = TEST_select.value;
        var TESTstates_select = document.getElementById('TESTstates_select')
        var TESTstates_select_Value = TESTstates_select.value
        var TESTstates_modify = document.getElementById('TESTstates_modify')
        var TESTstates_modify_Value = TESTstates_modify.value
        var qvalue_input = document.getElementById('qvalue_input')
        var qvalue_input_Value = qvalue_input.value
        //至少選一個按鈕
        if (!total_count_checked && !importance_checked && !auc_checked && !foldisChecked) {
            alert("Please select at least one condition");
            return; 
        }

        $.ajax({
            type: 'POST',
            url: '/DEM/RF_Model_screener_table_B1234/', 
            data: {
                'select_count_Value':select_count_Value,
                'select_importance_Value':select_importance_Value,
                'select_auc_Value':select_auc_Value ,
                'select_count_condition_Value':select_count_condition_Value,
                'select_importance_condition_Value':select_importance_condition_Value,
                'select_auc_condition_Value':select_auc_condition_Value,
                'FC_select_Condition': FC_select_Condition,
                'log2FC_Condition_value':log2FC_Condition_value,
                'TEST_select_Value': TEST_select_Value,
                'TESTstates_select_Value': TESTstates_select_Value,
                'TESTstates_modify_Value': TESTstates_modify_Value,
                'qvalue_input':qvalue_input_Value,
                'check_list': JSON.stringify(check_list)},
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
                table_html = '<table id="RF_result_Table" class="display" style="width:100%"></table>'
                document.getElementById('ans_table').innerHTML = table_html;
                var tableData = response.Table_Data_dict;
                var test_column_title = response.test_column_title

                if (check_list.includes("test")) {
                    $('#RF_result_Table').DataTable({
                        searching: true,
                        paging: true,
                        info: true,
                        data: tableData,
                        columns: [
                            { data: 'Metabolite', title: "Metabolite" },
                            { data: 'Total_Count', title: "Total Count" },
                            { data: 'Mean_Importance', title:"Mean Importance"},
                            { data: 'Metabolite_AUC', title:"AUC"},
                            { data: 'Metabolite name', title: "Metabolite name" },
                            { data: 'Patient_CRC', title: 'CRC Patient average' },
                            { data: 'Patient_Healthy', title: 'Healthy Patient average'},
                            { data: 'fold_change', title: 'Fold change(CRC/Healthy)'},
                            { data: test_column_title, title: "Q value" },

                        ],
                        columnDefs: [
                            { targets: '_all', className: 'text-center' }  
                          ],
                        deferRender: true, 
                        destroy: true,
                        });             
                }else{
                    $('#RF_result_Table').DataTable({
                        searching: true,
                        paging: true,
                        info: true,
                        data: tableData,
                        columns: [
                            { data: 'Metabolite', title: "Metabolite" },
                            { data: 'Total_Count', title: "Total Count" },
                            { data: 'Mean_Importance', title:"Mean Importance"},
                            { data: 'Metabolite_AUC', title:"AUC"},
                            { data: 'Metabolite name', title: "Metabolite name" },
                            { data: 'Patient_CRC', title: 'CRC Patient average' },
                            { data: 'Patient_Healthy', title: 'Healthy Patient average'},
                            { data: 'fold_change', title: 'Fold change(CRC/Healthy)'},

                        ],
                        columnDefs: [
                            { targets: '_all', className: 'text-center' }  
                          ],
                        deferRender: true, 
                        destroy: true,
                        });    
                }

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