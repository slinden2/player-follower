import os
import shutil


def push_to_heroku():
    os.system('git subtree push --prefix web heroku production')


def main():
    push_to_heroku()


if __name__ == "__main__":
    main()
