from rest_framework import serializers
from .models import WordClass

class WordClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = WordClass
        fields = ['id', 'word', 'definition']
           