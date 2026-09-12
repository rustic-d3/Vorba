from django.shortcuts import render
from rest_framework.decorators import action
from .models import SessionClass
from .serializers import SessionClassSerializer
from rest_framework import viewsets
from rest_framework.response import Response

# Create your views here.
class SessionViewSet(viewsets.ModelViewSet):
    queryset=SessionClass.objects.all()
    serializer_class = SessionClassSerializer
    
    @action(detail=False, methods=["post"], url_path='validate-session')
    def validate_session(self, request):
        print(request.data)
        return Response({"message":"All good"})
         