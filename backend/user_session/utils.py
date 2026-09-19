from .models import SessionClass
from django.db.models import Count, Q
from .models import SessionClass

def calculate_statistics(current_user_session: SessionClass):
    """
    Percentage of today's finished games that were won vs. lost.
    The current player's session is included, as it is saved before this is called.
    """
    totals = SessionClass.objects.filter(
        current_date=current_user_session.current_date,
        game_status__in=["win", "lose"],  # ignore sessions that never finished
    ).aggregate(
        total=Count("pk"),
        wins=Count("pk", filter=Q(game_status="win")),
    )
 
    total = totals["total"]
    if total == 0:
        return {"players": 0, "won_percent": 0.0, "lost_percent": 0.0}
 
    won_percent = round(totals["wins"] / total * 100, 1)
    return {
        "players": total,
        "won_percent": won_percent,
        "lost_percent": round(100 - won_percent, 1),
    }