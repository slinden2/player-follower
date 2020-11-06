import os
import datetime

# move to correct path
FILE_PATH = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), "backend")
os.chdir(FILE_PATH)

# day before first fetch date
date = datetime.datetime(2020, 7, 31)

for i in range(0, 62):
    date += datetime.timedelta(days=1)
    dateStr = date.strftime('%Y-%m-%d')
    os.system(f'npm run daily_fetch {date}')
