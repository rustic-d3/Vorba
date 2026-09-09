from django.db import models


game_stats = [
    ("in_progress", "În progres"),
    ("win", "Câștig")
    
]


# Create your models here.
class WordClass(models.Model):
    word = models.CharField(max_length=5)
    definition = models.CharField(max_length=255)
    
    class Meta:
        db_table = 'words'  
        managed = False
    def __str__(self):
        return f"{self.word}: {self.definition}"
    
class GameState(models.Model):
    currentRowIndex = models.IntegerField()
    status = models.CharField(choices=game_stats)
    