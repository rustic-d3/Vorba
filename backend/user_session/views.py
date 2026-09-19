import ast
import secrets
from pathlib import Path

from django.utils import timezone
from django.utils.dateparse import parse_date
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import SessionClass
from .serializers import SessionClassSerializer
from .utils import calculate_statistics

MAX_ROWS = 6
WORD_LENGTH = 5

game_stats = ["win", "lose"]

WORD_FILE = Path(__file__).resolve().parent / "word_of_the_day.txt"


def get_word_of_the_day():
    return WORD_FILE.read_text().strip()[:WORD_LENGTH].lower()


class SessionViewSet(viewsets.ModelViewSet):
    queryset = SessionClass.objects.all()
    serializer_class = SessionClassSerializer

    @action(detail=False, methods=["post"], url_path="validate-session")
    def validate_session(self, request):
        def bad(message):
            return Response({"message": message}, status=status.HTTP_400_BAD_REQUEST)

        session_id = request.data.get("session_id")
        if not session_id:
            return bad("session_id can't be empty")

        try:
            session_data = SessionClass.objects.get(session_id=session_id)
        except SessionClass.DoesNotExist:
            return Response({"message": "Session not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            row_index = int(request.data.get("row_index"))
            guess_list = request.data.get("guess_list")
            if isinstance(guess_list, str):
                guess_list = ast.literal_eval(guess_list)
            guess_list = [g.strip().lower() for g in guess_list]
            current_date = parse_date(request.data.get("current_date") or "")
        except (TypeError, ValueError, SyntaxError, AttributeError):
            return bad("Malformed request payload")

        game_status = request.data.get("game_status")

        if game_status not in game_stats:
            return bad("Game status invalid. Session corrupted")

        if current_date != timezone.localdate():
            return bad("Current date doesn't match today's date. Session corrupted")

        if not 1 <= len(guess_list) <= MAX_ROWS:
            return bad("Guess list invalid. Session corrupted")

        if row_index != len(guess_list):
            return bad("Row index differs from the length of the guess list. Session corrupted")

        if any(len(g) != WORD_LENGTH or not g.isalpha() for g in guess_list):
            return bad("Guess list contains an invalid word. Session corrupted")

        word_of_the_day = get_word_of_the_day()

        if word_of_the_day in guess_list[:-1]:
            return bad("Guesses continue after the correct word. Session corrupted")

        if guess_list[-1] == word_of_the_day:
            expected_status = "win"
        elif len(guess_list) == MAX_ROWS:
            expected_status = "lose"
        else:
            return bad("Game is not finished. Session corrupted")

        if game_status != expected_status:
            return bad("Game status doesn't match the guesses. Session corrupted")

        if session_data.current_date == current_date and session_data.game_status in game_stats:
            return Response({"message": "Session already validated for today"},
                            status=status.HTTP_409_CONFLICT)

        session_data.row_index = row_index
        session_data.game_status = game_status
        session_data.current_date = current_date
        session_data.save()

        statistics = calculate_statistics(session_data)
        return Response({"message": "Session validated", "statistic": statistics},
                        status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"], url_path="get-session")
    def get_session_id(self, request):
        session = SessionClass.objects.create(session_id=secrets.token_hex(16))
        return Response({"code": session.session_id})