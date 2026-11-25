import cv2
import os

video_path = r"D:\VINTALE-V3\pizza-shop-animated\public\pizza_shop_screen_recording.mp4"
output_dir = r"D:\VINTALE-V3\pizza-shop-animated\scratch"

cap = cv2.VideoCapture(video_path)
fps = cap.get(cv2.CAP_PROP_FPS)
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
duration = total_frames / fps if fps > 0 else 0
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

print(f"Video info: {width}x{height}, {fps} fps, {total_frames} frames, {duration:.2f}s")

# Extract one frame every 0.01 seconds = 100 fps
interval = 0.01
target_fps = 1.0 / interval
frame_interval = max(1, int(fps / target_fps))

print(f"Extracting every {frame_interval} frame(s) (target {target_fps} fps)")

count = 0
saved = 0
while True:
    ret, frame = cap.read()
    if not ret:
        break
    if count % frame_interval == 0:
        filename = os.path.join(output_dir, f"frame_{saved:04d}.png")
        cv2.imwrite(filename, frame)
        saved += 1
    count += 1

cap.release()
print(f"Done. Extracted {saved} frames from {count} total frames.")
