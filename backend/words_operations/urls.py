from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WordViewSet, game_logic

router = DefaultRouter()
router.register(r'words' , WordViewSet )

urlpatterns = [
    path('', include(router.urls)),
    path('check-word/', game_logic )
]
