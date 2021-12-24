#!/bin/bash
bash -c "exec -a cs324Server python3 -m http.server" &

google-chrome http://localhost:8000/
