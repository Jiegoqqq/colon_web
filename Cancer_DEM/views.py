import os
import json
import sys
import numbers
import pandas as pd
import numpy as np
import pymysql
from django.shortcuts import render
from datetime import datetime
from django.http import HttpResponse, JsonResponse
from django.db import connection
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt


# Create your views here.
def DEM_database(request):
    return render(request,'DEM_database.html', locals())

@csrf_exempt
def DEM_database_table(request):
    get_stage = request.POST.get('check_list')
    get_stage = get_stage.split(',')  
    
    mapping = {'stage0': 'N', 'stage1': 'A', 'stage2': 'B', 'stage3': 'C', 'stage4': 'D'}
    mapped_list = [mapping[item] for item in get_stage]
    CRC_Data_N = []
    if 'N' in mapped_list:
        print('Healthy')
        mapped_list = [item for item in mapped_list if item != 'N']

        sql_query = "SELECT * FROM CRC_Data_Healthy"  

        # 使用cursor執行SQL查詢並獲取結果
        with connection.cursor() as cursor:
            cursor.execute(sql_query)
            CRC_Data_N = pd.DataFrame(cursor.fetchall(), columns=[i[0] for i in cursor.description])

        #N以外的
        if len(mapped_list) != 0 :
            
            column_names = []

            for val in mapped_list:
                sql_query = """
                    SELECT COLUMN_NAME
                    FROM INFORMATION_SCHEMA.COLUMNS
                    WHERE TABLE_NAME = 'CRC_Data_CRC' AND COLUMN_NAME LIKE '{}%'
                """.format(val)

                with connection.cursor() as cursor:

                    cursor.execute(sql_query)
                    column_names += [column[0] for column in cursor.fetchall()]

            column_names = sorted(set(column_names), key=column_names.index)

            select_columns = ["Label"] + column_names
            sql_query = f"SELECT {', '.join(select_columns)} FROM CRC_Data_CRC"

            with connection.cursor() as cursor:

                cursor.execute(sql_query)
                result = cursor.fetchall()

            CRC_Data_merged = pd.DataFrame(result, columns=select_columns)
        else:
            CRC_Data_merged = []

###############################################################
    else:
        print('only CRC')
        # 初始化空的欄位名稱列表
        column_names = []

        # 遍歷 mapped_list 中的每個篩選條件
        for val in mapped_list:
            # 構建 SQL 查詢以擷取符合 mapping 映射值開頭的欄位名稱
            sql_query = """
                SELECT COLUMN_NAME
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_NAME = 'CRC_Data_CRC' AND COLUMN_NAME LIKE '{}%'
            """.format(val)

            with connection.cursor() as cursor:
                cursor.execute(sql_query)

                # 從資料庫中提取欄位名稱並加入到列表中
                column_names += [column[0] for column in cursor.fetchall()]

        # 去除重複的欄位名稱
        column_names = sorted(set(column_names), key=column_names.index)

        # 構建 SQL 查詢以僅擷取需要的資料列
        select_columns = ["Label"] + column_names
        sql_query = f"SELECT {', '.join(select_columns)} FROM CRC_Data_CRC"

        with connection.cursor() as cursor:
            cursor.execute(sql_query)

            # 直接從資料庫中提取資料
            result = cursor.fetchall()

        # 將結果轉換為 DataFrame
        CRC_Data_merged = pd.DataFrame(result, columns=select_columns)
##############################################################################    
    if len(CRC_Data_N) != 0:
        if len(CRC_Data_merged) != 0:
            print('0')
            CRC_Data_dict = CRC_Data_merged.to_dict(orient='records')  
            CRC_Data_N_dict = CRC_Data_N.to_dict('records')  
        else:
            print('1')
            CRC_Data_dict = CRC_Data_merged
            CRC_Data_N_dict = CRC_Data_N.to_dict('records')  
     
    else:
        print('2')
        CRC_Data_dict = CRC_Data_merged.to_dict(orient='records')
        CRC_Data_N_dict = CRC_Data_N

    print('Got it!')

    response = {
        'CRC_Data_dict':CRC_Data_dict,
        'CRC_Data_N_dict':CRC_Data_N_dict,
    }
    return JsonResponse(response)


######################################################################


def DEM_screener(request):
    return render(request,'DEM_screener.html', locals())

@csrf_exempt
def DEM_screener_table(request):

    cancer = request.POST.get('select_cancer_Value')
    condition1 = request.POST.get('select_condition1_Value')
    condition2 = request.POST.get('select_condition2_Value')
    # FC_select_Condition = request.POST.get('FC_select_Condition')
    log2FC = request.POST.get('log2FC_Condition_value')
    log2FC = int(log2FC)
    TEST_select = request.POST.get('TEST_select_Value')
    # TESTstates_select = request.POST.get('TESTstates_select_Value')
    TESTstates_modify = request.POST.get('TESTstates_modify_Value')
    qvalue_input = request.POST.get('qvalue_input')
    check_str = request.POST.get('check_list')
    check_list = json.loads(check_str)
    total_count = request.POST.get('select_count_Value')
    mean_importance = request.POST.get('select_importance_Value')
    auc_value = request.POST.get('select_auc_Value')
    total_count_condition = request.POST.get('select_count_condition_Value')
    mean_importance_condition  = request.POST.get('select_importance_condition_Value')
    auc_value_condition  = request.POST.get('select_auc_condition_Value')


    # print('cancer \n',cancer)
    # print('condition1 \n',condition1)
    # print('condition2 \n', condition2)
    # print('total condition \n',total_count_condition)
    # print('total count \n',total_count)
    # print('mean condition \n', mean_importance_condition)
    # print('mean importance \n', mean_importance)
    # print('auc condition \n',auc_value_condition)
    # print('auc value \n ',auc_value)
    # print('FC condition \n',FC_select_Condition)
    # print('FC input \n', log2FC)
    # print('Test select \n',TEST_select)
    # print('Test Direction \n', TESTstates_select)
    # print('Test Correction \n ', TESTstates_modify)
    # print('q value input \n',qvalue_input)
    # print('check list \n',check_list)

    table_name = cancer + '_' + condition1 + '_' + condition2
    print(table_name)

    sql_query = "SELECT * FROM {} WHERE 1=1".format(table_name)
    print('sql query',sql_query)
    # sql_query = "SELECT * FROM colon_web_data_staic_stage_B1234_with_test WHERE 1=1"
    params = []  
    # 判斷開關條件
    if total_count != '9999':
        if total_count_condition != '8888':
            if total_count_condition == 'greater':
                sql_query += " AND Total_Count > %s"
                params.append(total_count)
            elif total_count_condition == 'less':
                sql_query += " AND Total_Count < %s"
                params.append(total_count)
    if mean_importance != '9999':
        if mean_importance_condition != '8888':
            if mean_importance_condition == 'greater':
                sql_query += " AND Mean_Importance > %s"
                params.append(mean_importance)
            elif mean_importance_condition == 'less':
                sql_query += " AND Mean_Importance < %s"
                params.append(mean_importance)
    if auc_value != '9999':
        if auc_value_condition != '8888':
            if auc_value_condition == 'greater':
                sql_query += " AND Metabolite_AUC > %s"
                params.append(auc_value)
            elif auc_value_condition == 'less':
                sql_query += " AND Metabolite_AUC < %s"
                params.append(auc_value)
   
    if "foldchange" in check_list :
        # if FC_select_Condition == 'greater':
            sql_query += " AND foldchange >= %s"
            params.append(log2FC)
        # elif FC_select_Condition == 'less':
        #     sql_query += " AND foldchange <= %s"
        #     params.append(log2FC)

    #到資料庫拿資料
    with connection.cursor() as cursor:
        cursor.execute(sql_query, params)
        Table_Data = pd.DataFrame(cursor.fetchall(), columns=[i[0] for i in cursor.description]) #存全部數據的
    seleted_column = ['Metabolite','Total_Count','Mean_Importance','Metabolite_AUC',"Metabolite name","first_avg","second_avg","foldchange"]
    CRC_Data_web = Table_Data[seleted_column]

       
    test_column = []
    if "test" in check_list:
        if TESTstates_modify == 'None' :
            test_column = "%s_greater"%(TEST_select)
        else:
            test_column = "%s_greater(%s)"%(TEST_select,TESTstates_modify)
        # print('test column \n',test_column)        
        seleted_column = ['Metabolite','Total_Count','Mean_Importance','Metabolite_AUC',"Metabolite name","first_avg","second_avg","foldchange",test_column]
        CRC_Data_web = Table_Data[seleted_column]

        CRC_Data_web[test_column] = CRC_Data_web[test_column].replace("False", False)
        CRC_Data_web[test_column] = CRC_Data_web[test_column].astype(float)

        CRC_Data_web = CRC_Data_web.loc[CRC_Data_web[test_column] <= float(qvalue_input)]
        

    Table_Data= CRC_Data_web.fillna(0)    
    Table_Data_dict = Table_Data.to_dict(orient='records')

    response = {
        'Table_Data_dict': Table_Data_dict,
        'test_column_title': test_column,
    }
    return JsonResponse(response)



def RF_Model_screener(request):
    return render(request,'RF_Model_screener.html', locals())


@csrf_exempt
def RF_Model_screener_table(request):
    
    total_count = request.POST.get('select_count_Value')
    mean_importance = request.POST.get('select_importance_Value')
    auc_value = request.POST.get('select_auc_Value')
    # pvalue_value = request.POST.get('select_pvalue_Value')
    total_count_condition = request.POST.get('select_count_condition_Value')
    mean_importance_condition  = request.POST.get('select_importance_condition_Value')
    auc_value_condition  = request.POST.get('select_auc_condition_Value')

    sql_query = "SELECT * FROM colon_web_data_patient_scaled_staic_stage_B123 WHERE 1=1"
    params = []  

    # 判斷開關條件
    if total_count != '9999':
        if total_count_condition != '8888':
            if total_count_condition == 'greater':
                sql_query += " AND Total_Count > %s"
                params.append(total_count)
            elif total_count_condition == 'less':
                sql_query += " AND Total_Count < %s"
                params.append(total_count)
    if mean_importance != '9999':
        if mean_importance_condition != '8888':
            if mean_importance_condition == 'greater':
                sql_query += " AND Mean_Importance > %s"
                params.append(mean_importance)
            elif mean_importance_condition == 'less':
                sql_query += " AND Mean_Importance < %s"
                params.append(mean_importance)
    if auc_value != '9999':
        if auc_value_condition != '8888':
            if auc_value_condition == 'greater':
                sql_query += " AND Metabolite_AUC > %s"
                params.append(auc_value)
            elif auc_value_condition == 'less':
                sql_query += " AND Metabolite_AUC < %s"
                params.append(auc_value)
    # if pvalue_value != '9999':
    #     if pvalue_value_condition != '8888':
    #         if pvalue_value_condition == 'greater':
    #             sql_query += " AND p_value >= %s"
    #             params.append(pvalue_value)
    #         elif pvalue_value_condition == 'less':
    #             sql_query += " AND p_value < %s"
    #             params.append(auc_value)
    #到資料庫拿資料
    with connection.cursor() as cursor:
        cursor.execute(sql_query, params)
        Table_Data = pd.DataFrame(cursor.fetchall(), columns=[i[0] for i in cursor.description]) #存全部數據的

    # print(sql_query)

    Table_Data= Table_Data.fillna(0)    
    #只有Table要的欄位
    # Table_Data_show = Table_Data[['Metabolite', 'Total_Count', 'Mean_Importance', 'Metabolite_AUC', 'Metabolite name', 'Patient_CRC', 'Patient_Healthy', 'fold_change(CRC/Healthy)']]
    # Table_Data_dict = Table_Data_show.to_dict(orient='records')
    Table_Data_dict = Table_Data.to_dict(orient='records')

    response = {
        'Table_Data_dict': Table_Data_dict,
    }
    return JsonResponse(response)

def RF_Model_screener_B1234(request):
    return render(request,'RF_Model_screener_B1234.html', locals())

@csrf_exempt
def RF_Model_screener_table_B1234(request):
    
    total_count = request.POST.get('select_count_Value')
    mean_importance = request.POST.get('select_importance_Value')
    auc_value = request.POST.get('select_auc_Value')
    # pvalue_value = request.POST.get('select_pvalue_Value')
    total_count_condition = request.POST.get('select_count_condition_Value')
    mean_importance_condition  = request.POST.get('select_importance_condition_Value')
    auc_value_condition  = request.POST.get('select_auc_condition_Value')
    #統計測試
    FC_select_Condition = request.POST.get('FC_select_Condition')
    log2FC = request.POST.get('log2FC_Condition_value')
    TEST_select = request.POST.get('TEST_select_Value')
    TESTstates_select = request.POST.get('TESTstates_select_Value')
    TESTstates_modify = request.POST.get('TESTstates_modify_Value')
    qvalue_input = request.POST.get('qvalue_input')
    check_str = request.POST.get('check_list')
    check_list = json.loads(check_str)
    
    sql_query = "SELECT * FROM colon_web_data_staic_stage_B1234_with_test WHERE 1=1"
    params = []  

    # 判斷開關條件
    if total_count != '9999':
        if total_count_condition != '8888':
            if total_count_condition == 'greater':
                sql_query += " AND Total_Count > %s"
                params.append(total_count)
            elif total_count_condition == 'less':
                sql_query += " AND Total_Count < %s"
                params.append(total_count)
    if mean_importance != '9999':
        if mean_importance_condition != '8888':
            if mean_importance_condition == 'greater':
                sql_query += " AND Mean_Importance > %s"
                params.append(mean_importance)
            elif mean_importance_condition == 'less':
                sql_query += " AND Mean_Importance < %s"
                params.append(mean_importance)
    if auc_value != '9999':
        if auc_value_condition != '8888':
            if auc_value_condition == 'greater':
                sql_query += " AND Metabolite_AUC > %s"
                params.append(auc_value)
            elif auc_value_condition == 'less':
                sql_query += " AND Metabolite_AUC < %s"
                params.append(auc_value)
   
    if "foldchange" in check_list :
        if FC_select_Condition == 'greater':
            sql_query += " AND fold_change > %s"
            params.append(log2FC)
        elif FC_select_Condition == 'less':
            sql_query += " AND fold_change < %s"
            params.append(log2FC)
    #到資料庫拿資料
    with connection.cursor() as cursor:
        cursor.execute(sql_query, params)
        Table_Data = pd.DataFrame(cursor.fetchall(), columns=[i[0] for i in cursor.description]) #存全部數據的
    seleted_column = ['Metabolite','Total_Count','Mean_Importance','Metabolite_AUC',"Metabolite name","Patient_CRC","Patient_Healthy","fold_change"]
    CRC_Data_web = Table_Data[seleted_column]

       
    test_column = []
    if "test" in check_list:
        if TESTstates_modify == 'None' :
            test_column = "%s_%s"%(TEST_select,TESTstates_select)
        else:
            test_column = "%s_%s(%s)"%(TEST_select,TESTstates_select,TESTstates_modify)
        print('test column \n',test_column)        
        seleted_column = ['Metabolite','Total_Count','Mean_Importance','Metabolite_AUC',"Metabolite name","Patient_CRC","Patient_Healthy","fold_change",test_column]
        CRC_Data_web = Table_Data[seleted_column]

        CRC_Data_web[test_column] = CRC_Data_web[test_column].replace("False", False)
        CRC_Data_web[test_column] = CRC_Data_web[test_column].astype(float)

        CRC_Data_web = CRC_Data_web.loc[CRC_Data_web[test_column] <= float(qvalue_input)]
        # CRC_Data_web = CRC_Data_web[CRC_Data_web[test_column].replace("False", 0) <= qvalue_input]
        

    Table_Data= CRC_Data_web.fillna(0)    
    Table_Data_dict = Table_Data.to_dict(orient='records')

    response = {
        'Table_Data_dict': Table_Data_dict,
        'test_column_title': test_column,
    }
    return JsonResponse(response)