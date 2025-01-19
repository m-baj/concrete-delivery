from sqlmodel import Session
from app.models import User
from datetime import date
from app.core.config import settings
from app.models import Address, Courier, Status
from app.core.security import get_password_hash
from app.crud import get_admin

from app.models import UserCreate
from app.models import AddressCreate
from app.models import CourierRegister
from app.models import AccountType
from app.models import OrderCreate
from app.crud import add_address


def load_initial_data(session: Session):
    from app.api.routes.courier import register_courier
    from app.api.routes.order import create_order
    if not get_admin(session=session):
        admin = User(
            name="Admin",
            surname="Admin",
            phone_number=settings.ADMIN_PHONE_NUMBER,
            email_address=settings.ADMIN_EMAIL_ADDRESS,
            hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
            account_type=AccountType.ADMIN
        )
        session.add(admin)
        session.commit()
        print("Użytkownik admin został załadowany.")

    if not session.query(Status).first():
        print("Ładowanie początkowych danych statusów...")

        # Dodanie statusów
        statuses = [
            # Statusy dla zamówień
            Status(name="Order accepted"),  # Zlecenie przyjęte
            Status(name="Picking up order"),  # Odbieranie zamówienia
            Status(name="Order picked up"),  # Paczka odebrana od nadawcy
            Status(name="Delivering order"),  # Dostarczanie zamówienia
            Status(name="Order delivered"),  # Paczka dostarczona
            Status(name="Order lost"),  # Zamówienie zgubione
            # Statusy dla kurierów
            Status(name="Available"),  # Dostępny
            Status(name="Unavailable"),  # Niedostępny
            Status(name="On delivery"),  # W trakcie dostawy
        ]
        session.add_all(statuses)
        session.commit()
        print("Statusy zostały załadowane.")

    # Sprawdzenie, czy dane już istnieją
    if (
        session.query(Address).first()
        or session.query(Courier).first()
    ):
        print("Dane początkowe są już załadowane.")
        return

    print("Ładowanie danych początkowych...")

    user = User(
        name="Piotrek",
        surname="Zieliński",
        phone_number="111111112",
        email_address="piotr@example.com",
        account_type=AccountType.USER,
        hashed_password=get_password_hash("password"),
    )
    session.add(user)
    session.commit()

    home_address = AddressCreate(
        city="Warszawa",
        postal_code="12-345",
        street="Piękna",
        house_number="1",
        apartment_number="10"
    )

    courier_data = CourierRegister(
        name="Jacek",
        surname="Krzynówek",
        phone_number="111111111",
        home_address=home_address,
        email_address="jacek@example.com",
        password="password"
    )

    admin = get_admin(session=session)
    register_courier(session=session, current_user=admin, courier_in=courier_data)

    # # Dodanie adresów
    # address_1 = AddressCreate(
    #         city="Warszawa",
    #         postal_code="00-001",
    #         street="Marszałkowska",
    #         house_number="10",
    #         apartment_number="5"
    #     )
    # address_2 = AddressCreate(
    #         city="Warszawa",
    #         postal_code="00-002",
    #         street="Krucza",
    #         house_number="20",
    #         apartment_number="8"
    #     )
    # address_3 = AddressCreate(
    #         city="Warszawa",
    #         postal_code="00-003",
    #         street="Nowogrodzka",
    #         house_number="30",
    #         apartment_number="12"
    #     )
    # address_4 = AddressCreate(
    #         city="Warszawa",
    #         postal_code="00-004",
    #         street="Chmielna",
    #         house_number="40",
    #         apartment_number="15"
    #     )
    # pickup_address_1 = add_address(session=session, address=address_1)
    # delivery_address_1 = add_address(session=session, address=address_2)
    # pickup_address_2 = add_address(session=session, address=address_3)
    # delivery_address_2 = add_address(session=session, address=address_4)
    #
    # # Dane do pierwszego zamówienia
    # order_1 = OrderCreate(
    #     pickup_address=pickup_address_1,
    #     delivery_address=delivery_address_1,
    #     recipient_phone_number="123456789",
    #     pickup_start_time="10:00",
    #     pickup_end_time="11:30",
    #     delivery_start_time="14:00",
    #     delivery_end_time="15:30"
    # )
    #
    # # Dane do drugiego zamówienia
    # order_2 = OrderCreate(
    #     pickup_address=pickup_address_2,
    #     delivery_address=delivery_address_2,
    #     recipient_phone_number="987654321",
    #     pickup_start_time="9:30",
    #     pickup_end_time="11:30",
    #     delivery_start_time="15:00",
    #     delivery_end_time="16:00"
    # )
    #
    # # Tworzenie zamówień
    # db_order_1 = create_order(session=session, current_user=user, order=order_1)
    # db_order_2 = create_order(session=session, current_user=user, order=order_2)

    # print(f"Utworzono dwa zamówienia:\n{db_order_1}\n{db_order_2}")
