from apscheduler.schedulers.background import BackgroundScheduler

from app.core.config import settings
from .tasks import update_attendance

scheduler = BackgroundScheduler()
scheduler.add_job(update_attendance, "interval", seconds=settings.ATTENDANCE_UPDATE_INTERVAL_SECONDS)