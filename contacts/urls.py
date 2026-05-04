from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    ContactViewSet, RegisterViewSet, 
    login_view, register_view, contacts_list_view, 
    add_contact_view, edit_contact_view, logout_view
)

router = DefaultRouter()
router.register(r'contacts', ContactViewSet, basename='contact')
router.register(r'auth', RegisterViewSet, basename='auth')

urlpatterns = [
    # API Routes
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Template Routes
    path('', contacts_list_view, name='contacts_list'),
    path('login/', login_view, name='login'),
    path('register/', register_view, name='register'),
    path('logout/', logout_view, name='logout'),
    path('add/', add_contact_view, name='add_contact'),
    path('edit/', edit_contact_view, name='edit_contact'),
]

