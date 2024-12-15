import random
import string

def random_lower_string(length: int = 30) -> str:
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))

def random_phone_number() -> str:
    return "09" + ''.join(random.choices(string.digits, k=9))

def random_email() -> str:
    return random_lower_string(10) + "@" + random_lower_string(5) + ".com"