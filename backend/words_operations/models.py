from django.db import models

# Create your models here.
class WordClass(models.Model):
    word = models.CharField(max_length=5)
    definition = models.CharField(max_length=255)
    
    class Meta:
        db_table = 'words'  
        managed = False
    def __str__(self):
        return f"{self.word}: {self.definition}"
    