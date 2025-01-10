import secrets
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic_core import MultiHostUrl
from pydantic import PostgresDsn, computed_field
from neomodel import config

config.DATABASE_URL = "bolt://neo4j:krecimybeton@neo4j:7687"

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file="../env",
    )
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    PROJECT_NAME: str
    POSTGRES_SERVER: str = "postgres"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str

    ADMIN_PHONE_NUMBER: str = "000000000"
    ADMIN_EMAIL_ADDRESS: str = "superuser@test.com"
    ADMIN_PASSWORD: str

    NEO4J_URL: str
    NEO4J_NAME: str

    VROOM_URL: str

    @computed_field
    @property
    def DATABASE_URL(self) -> PostgresDsn:
        return MultiHostUrl.build(
            scheme="postgresql",
            username=self.POSTGRES_USER,
            password=self.POSTGRES_PASSWORD,
            host=self.POSTGRES_SERVER,
            port=self.POSTGRES_PORT,
            path=f"{self.POSTGRES_DB}",
        )

    TWILIO_ACCOUNT_SID: str
    TWILIO_AUTH_TOKEN: str
    TWILIO_VERIFY_SERVICE_SID: str
    TWILIO_PHONE_NUMBER: str


settings = Settings()
