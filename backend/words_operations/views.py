from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import WordClass
from .serializers import WordClassSerializer
from .services import check_word, get_color_code, word_of_the_day

wod=word_of_the_day().get("word_of_the_day")
class WordViewSet(viewsets.ModelViewSet):
    queryset = WordClass.objects.all()
    serializer_class = WordClassSerializer
    
    
@api_view(['POST'])
def game_logic(request):
    word = request.data.get('word').upper().strip()
    
    if word and len(word) == 5:
        api_response = check_word(word)
        if api_response:
            color_code= get_color_code(word, wod)
            return Response({"color_code": color_code})
        else:
            return Response({"message": "Nu exista acest cuvant"})
                      
    else:
        return Response(
            {"error": "Please provide a 'word' in the request body that is 5 letters long"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
     
    