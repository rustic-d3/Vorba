from django.db import models

game_stats = [
    ("in_progress", "În progres"),
    ("win", "Câștig"),
    ("lose", "Pierdere"),
    
]

class SessionClass(models.Model):
    session_id = models.CharField(max_length=255, primary_key=True)
    row_index = models.IntegerField()
    game_status = models.CharField(choices=game_stats)
    current_date = models.DateTimeField()
    