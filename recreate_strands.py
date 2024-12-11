from PIL import Image, ImageDraw, ImageFont
import math

def recreate_board(json_data, output_file="board.png"):
    starting_board = json_data.get("startingBoard")
    theme_coords = json_data.get("themeCoords")
    spangram_coords = json_data.get("spangramCoords")

    if not starting_board or not theme_coords or not spangram_coords:
        raise ValueError("Invalid JSON data.")

    cell_size = 60
    font_size = 20
    grid_width = len(starting_board[0])
    grid_height = len(starting_board)
    image_width = cell_size * grid_width
    image_height = cell_size * grid_height

    # Color definitions
    normal_blue = "#aedfee"
    alternate_blue = "#adbeed"
    normal_gold = "#f8cd05"
    alternate_gold = "#e2bb0b"

    img = Image.new("RGB", (image_width, image_height), "white")
    draw = ImageDraw.Draw(img)

    try:
        font = ImageFont.truetype('./font.woff2', font_size)
    except IOError:
        font = ImageFont.load_default()

    radius = cell_size // 2 - 10

    # Draw circles and lines for theme words
    for word, coords in theme_coords.items():
        centers = []
        for idx, coord in enumerate(coords):
            y, x = coord
            center_x = x * cell_size + cell_size // 2
            center_y = y * cell_size + cell_size // 2
            centers.append((center_x, center_y))
            # Choose color based on position in the word
            color = alternate_blue if idx == 0 else normal_blue
            # Draw filled circle behind letters
            draw.ellipse(
                [(center_x - radius, center_y - radius),
                 (center_x + radius, center_y + radius)],
                fill=color
            )
        # Draw lines connecting circles
        for i in range(len(centers) - 1):
            start = calculate_edge_point(centers[i], centers[i + 1], radius)
            end = calculate_edge_point(centers[i + 1], centers[i], radius)
            draw.line([start, end], fill=normal_blue, width=4)  # Thicker lines

    # Draw circles and lines for spangram
    spangram_centers = []
    for idx, coord in enumerate(spangram_coords):
        y, x = coord
        center_x = x * cell_size + cell_size // 2
        center_y = y * cell_size + cell_size // 2
        spangram_centers.append((center_x, center_y))
        # Choose color based on position in the spangram
        color = alternate_gold if idx == 0 else normal_gold
        # Draw filled circle behind letters
        draw.ellipse(
            [(center_x - radius, center_y - radius),
             (center_x + radius, center_y + radius)],
            fill=color
        )
    # Draw lines connecting spangram circles
    for i in range(len(spangram_centers) - 1):
        start = calculate_edge_point(spangram_centers[i], spangram_centers[i + 1], radius)
        end = calculate_edge_point(spangram_centers[i + 1], spangram_centers[i], radius)
        draw.line([start, end], fill=normal_gold, width=4)  # Thicker lines

    # Draw letters
    for y, row in enumerate(starting_board):
        for x, letter in enumerate(row):
            center_x = x * cell_size + cell_size // 2
            center_y = y * cell_size + cell_size // 2
            text_bbox = draw.textbbox((0, 0), letter, font=font)
            text_width = text_bbox[2] - text_bbox[0]
            text_height = text_bbox[3] - text_bbox[1]
            text_position = (
                center_x - text_width // 2,
                center_y - text_height // 2
            )
            draw.text(text_position, letter, fill="black", font=font)

    img.save(output_file, "PNG")

def calculate_edge_point(center1, center2, radius):
    dx = center2[0] - center1[0]
    dy = center2[1] - center1[1]
    distance = math.hypot(dx, dy)
    if distance == 0:
        return center1
    ratio = radius / distance
    edge_x = center1[0] + dx * ratio
    edge_y = center1[1] + dy * ratio
    return (edge_x, edge_y)
