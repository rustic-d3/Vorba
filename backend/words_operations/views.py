import datetime
from django.utils import timezone


from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import WordClass
from .serializers import WordClassSerializer


class WordViewSet(viewsets.ModelViewSet):
    queryset = WordClass.objects.all()
    serializer_class = WordClassSerializer
    
    @action(detail=False, methods=['get'], url_path='get-wod')    
    def get_wod(self, request):
        start_date = datetime.date(2026, 9, 1)     
        today = timezone.localdate()
        days_passed = (today - start_date).days
        total_words = WordClass.objects.count()   
        if total_words == 0:
            return None
            
        index = days_passed % total_words
        word_of_the_day = WordClass.objects.order_by('id')[index]
        definition = word_of_the_day.definition
            
        return Response({"word_of_the_day": word_of_the_day.word, "definition": definition })
    
      
