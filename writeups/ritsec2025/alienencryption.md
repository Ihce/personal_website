---
title: "Alien Encryption"
date: "2025-03-31"
tags: ["web", "javascript", "exploitation"]
description: "Ritsec crypto ctf"
---

# Challenge
The aliens are trying to figure out human encryption. Looks like they've tried their hand at RSA. I don't think they quite understand it yet... The flag is RS{message}

(n, e) = (196603733802071409961275562212278242151, 65537)
c = 151832817966710307438243645623410737448


# Solution 
I just tried brute forcing over night with different algorithms.

Here is one that actually finishes using Pollard Rho
https://www.geeksforgeeks.org/pollards-rho-algorithm-prime-factorization/
```python=

import threading
import time
import gmpy2
from gmpy2 import mpz, gcd, powmod

# Global variable for iteration count
iteration_count = 0
# Event to signal the progress thread to stop
stop_event = threading.Event()

def progress_bar():
    """Print progress every second until stop_event is set."""
    while not stop_event.is_set():
        print("Iterations:", iteration_count)
        time.sleep(1)
    print("Final iteration count:", iteration_count)

def pollard_rho(n):
    """Return a non-trivial factor of n using Pollard's Rho algorithm with progress tracking."""
    global iteration_count
    if n % 2 == 0:
        return mpz(2)
    
    x = mpz(2)
    y = mpz(2)
    c = mpz(1)  # constant c
    d = mpz(1)
    
    while d == 1:
        iteration_count += 1
        x = (powmod(x, 2, n) + c) % n
        y = (powmod(y, 2, n) + c) % n
        y = (powmod(y, 2, n) + c) % n
        d = gcd(abs(x - y), n)
        if d == n:
            # Retry with a different constant if we hit a failure case.
            c += 1
            x = mpz(2)
            y = mpz(2)
            d = mpz(1)
    return d

# The RSA modulus (n) as provided
n = mpz("196603733802071409961275562212278242151")

# Start the progress thread
progress_thread = threading.Thread(target=progress_bar)
progress_thread.start()

# Factor n using Pollard's Rho
p = pollard_rho(n)
q = n // p

# Signal the progress thread to stop and wait for it to finish
stop_event.set()
progress_thread.join()

print("p =", p)
print("q =", q)

# If desired, continue with RSA decryption
e = mpz("65537")
c = mpz("151832817966710307438243645623410737448")

# Compute Euler's totient function
phi = (p - 1) * (q - 1)

# Compute the modular inverse of e modulo φ(n)
d = gmpy2.invert(e, phi)
print("d =", d)

# Decrypt the ciphertext: m = c^d mod n
m = gmpy2.powmod(c, d, n)
print("Decrypted m =", m)

# Optional: Convert the decrypted integer to bytes (if it represents a message)
try:
    m_bytes = m.to_bytes((m.bit_length() + 7) // 8, 'big')
    print("Message (bytes):", m_bytes)
except Exception as exc:
    print("Could not convert m to bytes:", exc)
```

Final Output
```bash=
Final iteration count: 921937842
p = 879421070503884397
q = 223560408541749867683
d = 191794911529390016480993266827135293777
Decrypted m = 232190557692152706
Message (bytes): b'\x038\xe8\x14\xffp\xcb\x82'
```