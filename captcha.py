from twocaptcha import TwoCaptcha
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.realpath(__file__))))

api_key = os.getenv('APIKEY_2CAPTCHA', 'YOUR_API_KEY_HERE')

solver = TwoCaptcha(api_key)

try:
    result = solver.normal(sys.argv[1])

except Exception as e:
    sys.stdout.flush()

else:
    print(str(result))
    sys.stdout.flush()