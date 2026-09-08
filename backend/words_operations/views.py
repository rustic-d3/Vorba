from django.shortcuts import render
from rest_framework import viewsets
from .models import WordClass
from .serializers import WordClassSerializer

class WordViewSet(viewsets.ModelViewSet):
    queryset = WordClass.objects.all()
    serializer_class = WordClassSerializer