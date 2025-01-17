from datetime import datetime
import pytz

def hour_from_str_to_seconds(hour: str) -> int:
    try:
        time_obj = datetime.strptime(hour, "%H:%M").time()
        time_in_seconds = time_obj.hour * 3600 + time_obj.minute * 60
        return time_in_seconds
    except ValueError:
        raise ValueError("Invalid hour format. Expected format 'HH:MM' or 'H:MM'")

def hour_from_str_to_timestamp(hour: str) -> int:
    try:
        warsaw_tz = pytz.timezone("Europe/Warsaw")
        today = datetime.now(warsaw_tz).date()
        full_datetime = datetime.strptime(hour, "%H:%M").replace(year=today.year, month=today.month, day=today.day, tzinfo=warsaw_tz)
        return int(full_datetime.timestamp())
    except ValueError:
        raise ValueError("Invalid hour format. Expected format 'HH:MM' or 'H:MM'")