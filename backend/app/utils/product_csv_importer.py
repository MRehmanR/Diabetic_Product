import csv
import re
from dataclasses import dataclass
from pathlib import Path


DEFAULT_IMAGE_URL = "/uploads/product-placeholder.svg"


@dataclass(frozen=True)
class ImportedProduct:
    name: str
    brand: str
    serial_number: str | None
    short_description: str
    image_url: str
    category: str


def normalize_brand(value: str) -> str:
    return re.sub(r"\s+", " ", value.strip()).upper()


def category_from_brand(brand: str) -> str:
    category = re.sub(r"[^a-z0-9]+", "-", brand.lower()).strip("-")
    return category or "products"


def clean_cell(value: str) -> str:
    return re.sub(r"\s+", " ", value.replace("\xa0", " ")).strip()


def is_section_header(row: list[str]) -> bool:
    if len(row) < 4:
        return False

    title = clean_cell(row[1])
    serial_header = clean_cell(row[2]).upper()
    condition_header = clean_cell(row[3]).upper()

    return bool(title) and serial_header in {"NDC/NRC", "NDC", "NRC"} and condition_header == "CONDITION"


def is_product_row(row: list[str]) -> bool:
    if len(row) < 4:
        return False

    name = clean_cell(row[1])
    condition = clean_cell(row[3]).lower()

    return bool(name) and condition in {"mint", "ding", "damaged"}


def parse_product_csv(
    path: str | Path,
    default_image_url: str = DEFAULT_IMAGE_URL,
) -> list[ImportedProduct]:
    csv_path = Path(path)
    current_brand = ""
    products: list[ImportedProduct] = []
    seen: set[tuple[str, str, str]] = set()

    with csv_path.open(newline="", encoding="utf-8-sig") as handle:
        for row in csv.reader(handle):
            if is_section_header(row):
                current_brand = normalize_brand(row[1])
                continue

            if not current_brand or not is_product_row(row):
                continue

            name = clean_cell(row[1])
            serial_number = clean_cell(row[2]) or None
            condition = clean_cell(row[3])
            key = (current_brand, name.casefold(), serial_number or "")

            if key in seen:
                continue

            seen.add(key)
            products.append(
                ImportedProduct(
                    name=name,
                    brand=current_brand,
                    serial_number=serial_number,
                    short_description=f"Condition: {condition}",
                    image_url=default_image_url,
                    category=category_from_brand(current_brand),
                )
            )

    return products
