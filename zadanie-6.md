flowchart LR
    commit[Commit] --> build[Build]
    build --> test[Test]
    test --> deploy[Deploy]
wygląd:
cztery bloki od których idą do siebie strzałki w prawą stronę. Bloki to po kolei: Commit, Build, Test i Deploy