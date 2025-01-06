def hour_from_str_to_seconds(hour: str) -> int:
    if len(hour) == 5:
        time_in_seconds = (
            int(hour[0]) * 36000
            + int(hour[1]) * 3600
            + int(hour[3]) * 600
            + int(hour[4]) * 60
        )
    elif len(hour) == 4:
        time_in_seconds = int(hour[0]) * 3600 + int(hour[2]) * 600 + int(hour[3]) * 60
    else:
        print(len(hour))
        raise ValueError("Invalid hour format")
    return time_in_seconds
