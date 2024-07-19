from django.urls import path,re_path
from . import views

urlpatterns = [
    path('database/',views.DEM_database),
    path('DEM_screener/',views.DEM_screener),
    path('RF_Model/',views.RF_Model_screener),
    path('RF_Model_B1234/',views.RF_Model_screener_B1234),
    path('DEM_database_table/',views.DEM_database_table),
    path('DEM_screener_table/',views.DEM_screener_table),
    path('RF_Model_screener_table/',views.RF_Model_screener_table),
    path('RF_Model_screener_table_B1234/',views.RF_Model_screener_table_B1234),
]