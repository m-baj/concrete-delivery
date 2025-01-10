import random
import string
import uuid


def random_lower_string(length: int = 30) -> str:
    return "".join(random.choices(string.ascii_lowercase + string.digits, k=length))


def random_phone_number() -> str:
    return "09" + "".join(random.choices(string.digits, k=9))


def random_email() -> str:
    return random_lower_string(10) + "@" + random_lower_string(5) + ".com"


def random_number_to_100() -> int:
    return random.randint(1, 100)


def random_uuid4() -> str:
    return uuid.uuid4()
