from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.UsersListView.as_view(), name='users_list'),
    path('profile/<str:username>/', views.UserProfileView.as_view(), name='user_profile'),
    path('register/', views.RegisterUserView.as_view(), name='register_user'),
    path('update/', views.UpdateUserView.as_view(), name='update_user'),
    path('delete/', views.DeleteUserView.as_view(), name='delete_user'),
    path('login/', views.LoginUserView.as_view(), name='login_user'),
    path('logout/', views.LogoutUserView.as_view(), name='logout_user'),
]