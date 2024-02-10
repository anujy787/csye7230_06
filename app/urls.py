from django.urls import path
from django.urls import path, include
from .views import RegisterView, LoginView

urlpatterns = [
    path("", RegisterView.as_view()),
    path("/self", LoginView.as_view()),
]
