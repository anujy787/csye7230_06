from django.urls import path
from .views import RegisterView, LoginView
from . import views

urlpatterns = [
    path("v1/user", RegisterView.as_view()),
    path("v1/user/self", LoginView.as_view()),
]
