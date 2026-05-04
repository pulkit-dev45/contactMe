from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Contact
from .serializers import ContactSerializer, RegisterSerializer, UserSerializer


# ===== API Views =====
class RegisterViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Registration successful'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ContactViewSet(viewsets.ModelViewSet):
    serializer_class = ContactSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Contact.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        email = request.data.get('email')
        phone = request.data.get('phone')
        
        if email and Contact.objects.filter(user=request.user, email=email).exists():
            return Response({'email': 'Contact with this email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        if phone and Contact.objects.filter(user=request.user, phone=phone).exists():
            return Response({'phone': 'Contact with this phone already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        return super().create(request, *args, **kwargs)


# ===== Template Views =====
def login_view(request):
    return render(request, 'login.html', {'show_navbar': False, 'required_auth': False})


def register_view(request):
    return render(request, 'register.html', {'show_navbar': False, 'required_auth': False})


def contacts_list_view(request):
    return render(request, 'contacts_list.html', {'show_navbar': True, 'required_auth': True})


def add_contact_view(request):
    return render(request, 'add_contact.html', {'edit_mode': True, 'show_navbar': True, 'required_auth': True})


def edit_contact_view(request):
    return render(request, 'add_contact.html', {'edit_mode': True, 'show_navbar': True, 'required_auth': True})


def logout_view(request):
    from django.contrib.auth import logout
    logout(request)
    return redirect('login')

