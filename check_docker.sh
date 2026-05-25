#!/bin/bash

if systemctl is-active --quiet docker; then
    echo "Usługa docker działa."
    exit 0
fi

echo "Usługa docker zatrzymana. Uruchamiam..."
sudo systemctl start docker

if systemctl is-active --quiet docker; then
    echo "Usługa docker uruchomiona."
    exit 0
else
    echo "Nie udało się uruchomić usługi docker."
    exit 1
fi