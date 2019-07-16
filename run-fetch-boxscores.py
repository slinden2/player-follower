import os
import datetime

# move to correct path
FILE_PATH = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), "backend")
os.chdir(FILE_PATH)

# day before first fetch date
date = datetime.datetime(2019, 1, 8)

for i in range(0, 45):
    date += datetime.timedelta(days=1)
    dateStr = date.strftime('%Y-%m-%d')
    os.system(f'npm run fetch_boxscores {date}')
