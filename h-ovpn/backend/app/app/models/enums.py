from enum import Enum


class Os(Enum):
    ANDROID = 'android'
    LINUX = 'linux'
    WINDOWS = 'windows'
    IOS = "ios"
    MACOS = 'macos'

class JwtToken(Enum):
    password_reset_token = 'password_reset_token'
    LINUX = 'linux'
    WINDOWS = 'windows'
    IOS = "ios"
    MACOS = 'macos'