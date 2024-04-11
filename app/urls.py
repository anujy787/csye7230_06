from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    TravelPlanCreateView,
    TravelPlanUpdateView,
    AllTravelPlansView,
)
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path("v1/user", RegisterView.as_view(), name="reg"),
    path("v1/user/self", LoginView.as_view(), name="log"),
    path("v1/plan", TravelPlanCreateView.as_view(), name="create-travel-plan"),
    path("v1/plan/self", TravelPlanUpdateView.as_view(), name="create-travel-plan"),
    path(
        "v1/plan/self/<int:pk>",
        TravelPlanUpdateView.as_view(),
        name="update-travel-plan",
    ),
    path("v1/allplans/", AllTravelPlansView.as_view(), name="all-travel-plans"),
    path("", views.home, name="home"),
    path("login/", views.login, name="login"),
    path("logout/", auth_views.LogoutView.as_view(), name="logout"),
]
