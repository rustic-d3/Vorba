from rest_framework import serializers
from .models import SessionClass

class SessionClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = SessionClass
        fields = ['session_id', 'row_index', 'game_status', 'current_date']
        
        