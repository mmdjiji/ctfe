from flag import flag

def enc(plain):
    cipher = []
    for i in plain:
        m = ord(i)
        cipher.append(5 * m ** 2 + 6 * m - 8)
    return cipher

print(enc(flag))

# [52624, 58960, 47619, 53655, 76375, 67968, 54696, 55747, 66807, 45687, 55747, 66807, 45687, 51603, 47619, 66807, 73923, 45687, 49591, 65656, 73923, 63384, 67968, 62263, 78867]