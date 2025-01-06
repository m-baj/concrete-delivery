from datetime import datetime

def hour_from_str_to_seconds(hour: str) -> int:
    try:
        time_obj = datetime.strptime(hour, "%H.%M").time()
        time_in_seconds = time_obj.hour * 3600 + time_obj.minute * 60
        return time_in_seconds
    except ValueError:
        raise ValueError("Invalid hour format. Expected format 'HH.MM' or 'H.MM'")
