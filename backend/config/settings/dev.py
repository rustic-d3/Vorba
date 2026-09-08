import dj_database_url

from .base import *

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY_DEV')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True


# Database
# https://docs.djangoproject.com/en/6.1/ref/settings/#databases

if "DATABASE_URL" in os.environ:
    
    DATABASES = {
        'default': dj_database_url.config(
        conn_max_age=500,
        conn_health_checks=True,
    )
    }
    