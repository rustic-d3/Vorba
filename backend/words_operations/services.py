from django.utils import timezone
import requests
from rest_framework.response import Response
from rest_framework import status
import datetime

from .models import WordClass

def check_word(word):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) MyDjangoApp/1.0"
    }
    try:
        
        response = requests.get(f"https://dexonline.ro/definitie/{word}/json", headers=headers)
    
        if response.status_code == 200:
            
            definitions = response.json().get('definitions', [])
        
            if definitions:
                return True
            else:
                
                return False

        elif response.status_code == 404:
            return False

        else:
            return Response(
                {"error": f"Dex Server ERROR: {response.status_code}"}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
    except requests.ConnectionError:
        return Response({"error": "Eroare cerere http"}, status=status.HTTP_502_BAD_GATEWAY)

def word_of_the_day():
    start_date = datetime.date(2026, 9, 1)     
    today = timezone.localdate()
    days_passed = (today - start_date).days
    total_words = WordClass.objects.count()   
    if total_words == 0:
        return None
    
    index = days_passed % total_words
    word_of_the_day = WordClass.objects.order_by('id')[index]
    definition = word_of_the_day.definition
    
    return {"word_of_the_day": word_of_the_day.word, "definition": definition }