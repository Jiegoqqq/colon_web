from django.contrib import admin
from django.urls import path ,include

# from django.conf.urls import url, include
from Cancer_DEM import views


# router1 = routers.DefaultRouter()
# router1.register(r'', views.UPDATEGENEANNOTATIONViewSet, basename="update_GeneAnnotation")

#用來決定網址名稱
urlpatterns = [
    path("admin/", admin.site.urls),
    path('DEM/',include('Cancer_DEM.urls')),
    # path(r'update_GeneAnnotation/', include(router1.urls)),
]


