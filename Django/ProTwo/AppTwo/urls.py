from django.urls.conf import path
from AppTwo import views

urlpatterns = [
    path('', views.help, name='help'),
]