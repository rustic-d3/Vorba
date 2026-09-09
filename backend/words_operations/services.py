import requests
from rest_framework.response import Response
from rest_framework import status

def check_word(word):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) MyDjangoApp/1.0"
    }
    try:
        
        response = requests.get(f"https://dexonline.ro/definitie/{word}/json", headers=headers)
    
        if response.status_code == 200:
            
            definitions = response.json().get('definitions', [])
        
            if definitions:
                return Response({"result": True})
            else:
                
                return Response({"result": False}, status=status.HTTP_404_NOT_FOUND)

        elif response.status_code == 404:
            return Response({"result": False}, status=status.HTTP_404_NOT_FOUND)

        else:
            return Response(
                {"error": f"Dex Server ERROR: {response.status_code}"}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
    except requests.ConnectionError:
        return Response({"error": "Eroare cerere http"}, status=status.HTTP_502_BAD_GATEWAY)
        