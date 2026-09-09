from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import WordClass
from .serializers import WordClassSerializer
from .services import check_word

class WordViewSet(viewsets.ModelViewSet):
    queryset = WordClass.objects.all()
    serializer_class = WordClassSerializer
    
    
@api_view(['POST'])
def game_logic(request):
    word = request.data.get('word')
    if word:
        print(request)
        api_response = check_word(word)
        return api_response
    else:
        return Response(
            {"error": "Please provide a 'word' in the request body."}, 
            status=status.HTTP_400_BAD_REQUEST
        )
     
    