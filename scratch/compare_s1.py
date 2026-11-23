import sys
import zlib
import struct

def read_png_pixels(path):
    with open(path, "rb") as f:
        data = f.read()
    
    assert data[:8] == b"\x89PNG\r\n\x1a\n", f"Not a PNG: {path}"
    
    pos = 8
    width = height = None
    bit_depth = color_type = None
    idat_chunks = []
    
    while pos < len(data):
        length = struct.unpack(">I", data[pos:pos+4])[0]
        chunk_type = data[pos+4:pos+8]
        chunk_data = data[pos+8:pos+8+length]
        pos += 12 + length
        
        if chunk_type == b"IHDR":
            width, height, bit_depth, color_type = struct.unpack(">IIBB", chunk_data[:10])
        elif chunk_type == b"IDAT":
            idat_chunks.append(chunk_data)
        elif chunk_type == b"IEND":
            break
            
    raw = zlib.decompress(b"".join(idat_chunks))
    return width, height, raw

frames = [15, 120, 210, 330]
print("Comparing S1 baseline before vs after stills:")
all_passed = True

for frame in frames:
    before_path = f"out/stills/s1-before/still-{frame}.png"
    after_path = f"out/stills/s1-after/still-{frame}.png"
    
    w1, h1, raw1 = read_png_pixels(before_path)
    w2, h2, raw2 = read_png_pixels(after_path)
    
    assert (w1, h1) == (w2, h2), f"Dimensions mismatch for frame {frame}: {w1}x{h1} vs {w2}x{h2}"
    
    if raw1 == raw2:
        print(f"Frame {frame:3d}: PERFECT MATCH (0 bytes difference)")
    else:
        # Count byte differences
        diffs = sum(1 for a, b in zip(raw1, raw2) if a != b)
        total = len(raw1)
        ratio = diffs / total
        max_diff = max(abs(a - b) for a, b in zip(raw1, raw2))
        print(f"Frame {frame:3d}: diff bytes = {diffs} / {total} ({ratio*100:.3f}%), max byte delta = {max_diff}")
        if ratio > 0.01:
            all_passed = False

if all_passed:
    print("SUCCESS: Zero regressions between S1 before and after!")
else:
    print("FAILED: Substantial visual drift detected.")
    sys.exit(1)
