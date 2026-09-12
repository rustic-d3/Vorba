import ast

from django.shortcuts import render
from django.utils import timezone
from rest_framework.decorators import action
from .models import SessionClass
from .serializers import SessionClassSerializer
from rest_framework import viewsets
from rest_framework.response import Response
from django.utils.dateparse import parse_datetime

# Create your views here.
class SessionViewSet(viewsets.ModelViewSet):
    queryset=SessionClass.objects.all()
    serializer_class = SessionClassSerializer
    
    @action(detail=False, methods=["post"], url_path='validate-session')
    def validate_session(self, request):
        data = request.data
        print(request.data)
        # {'current_date': '2026-09-12T09:41:30.803Z',
        # 'game_status': 'win',
        # 'guess_list': '["zalud"]',
        # 'row_index': '1',
        # 'session_id': 'f69c41bd-abd8-45dd-915d-0ffae76934f0'
        # }
        if not data["current_date"]:
                    return Response({"message": "Missing date"})
        today = timezone.localdate()
        parsed_datetime = parse_datetime(data["current_date"]) 
        current_date = timezone.localtime(parsed_datetime)
        guess_list = data["guess_list"]
        guess_list = ast.literal_eval(guess_list)
        guess_list = [n.strip() for n in guess_list]
        row_index = int(data["row_index"])
        session_id = data["session_id"]
        game_status = data["game_status"]
        
        db_session_id = SessionClass.objects.filter(session_id=session_id)
        if(db_session_id):
            return Response({"message":"Session already validated"})
           
        if current_date.date() != timezone.localdate():
            return Response({"message": "Invalid session"})
        if len(guess_list) != 6:
            return Response({"message":"Invalid session"})
        with open("user_session/word_of_the_day.txt") as f:
                        word_of_the_day=f.read().strip().lower()
                 
        if word_of_the_day not in guess_list and row_index != 6:
            return Response({"message":"Invalid session"}) 
        
        valid_session = SessionClass(session_id=session_id, row_index=row_index, game_status=game_status, current_date=current_date, state="valid" )
        valid_session.save()
        return Response({"message":"Valid Session"})
         