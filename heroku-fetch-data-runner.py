import os

dates = [
    # '2019-01-16',
    # '2019-01-17',
    # '2019-01-18',
    # '2019-01-19',
    # '2019-01-20',
    # '2019-01-21',
    # '2019-01-22',
    # '2019-01-23',
    # '2019-01-24', # no games for this date. throws Unhandled promise rejections.
    # '2019-01-25', # no games for this date. throws Unhandled promise rejections.
    # '2019-01-26',
    # '2019-01-27', # no games for this date. throws Unhandled promise rejections.
    # '2019-01-28',
    # '2019-01-29',
    # '2019-01-30',
    # '2019-01-31',
    # '2019-02-01',
    # '2019-02-02',
    # '2019-02-03',
    # '2019-02-04',
    # '2019-02-05',
    # '2019-02-06',
]

for date in dates:
    os.system(f"heroku run FETCH_DATE={date} node jobs/fetch-data.js")
