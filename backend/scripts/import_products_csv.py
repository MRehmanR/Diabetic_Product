from __future__ import annotations

import argparse
import asyncio
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
REPO_DIR = BACKEND_DIR.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.utils.product_csv_importer import DEFAULT_IMAGE_URL, parse_product_csv  # noqa: E402


DEFAULT_CSV_PATH = REPO_DIR / "Prestige Medical Supply Pricelist - Pricelist .csv"


async def import_products(
    csv_path: Path,
    default_image_url: str = DEFAULT_IMAGE_URL,
    dry_run: bool = False,
) -> tuple[int, int]:
    products = parse_product_csv(csv_path, default_image_url=default_image_url)
    if dry_run:
        return len(products), 0

    from sqlalchemy import func, select

    from app.database.database import AsyncSessionLocal
    from app.models.product import Product
    from app.schemas.product import ProductCreate
    from app.services import product_service

    imported = 0
    skipped = 0

    async with AsyncSessionLocal() as db:
        for product in products:
            query = select(Product.id).where(
                func.lower(Product.brand) == product.brand.lower(),
                func.lower(Product.name) == product.name.lower(),
            )

            if product.serial_number:
                query = query.where(Product.serial_number == product.serial_number)
            else:
                query = query.where(Product.serial_number.is_(None))

            exists = (await db.execute(query.limit(1))).scalar_one_or_none()
            if exists:
                skipped += 1
                continue

            await product_service.create_product(
                db,
                ProductCreate(
                    name=product.name,
                    brand=product.brand,
                    serial_number=product.serial_number,
                    category=product.category,
                    short_description=product.short_description,
                    full_description=product.short_description,
                    accepted_models=[],
                    requirements=[],
                    image_url=product.image_url,
                    status="active",
                    features=[],
                    is_active=True,
                ),
            )
            imported += 1

    return imported, skipped


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Import product rows from the product CSV.")
    parser.add_argument(
        "--csv",
        type=Path,
        default=DEFAULT_CSV_PATH,
        help=f"CSV file path. Defaults to {DEFAULT_CSV_PATH}",
    )
    parser.add_argument(
        "--default-image-url",
        default=DEFAULT_IMAGE_URL,
        help=f"Image URL used when the CSV does not include an image. Defaults to {DEFAULT_IMAGE_URL}",
    )
    parser.add_argument("--dry-run", action="store_true", help="Parse and count without writing to the database.")
    return parser.parse_args()


async def main() -> None:
    args = parse_args()
    if not args.csv.exists():
        raise SystemExit(f"CSV file not found: {args.csv}")

    imported, skipped = await import_products(
        args.csv,
        default_image_url=args.default_image_url,
        dry_run=args.dry_run,
    )
    action = "Would import" if args.dry_run else "Imported"
    print(f"{action} {imported} products. Skipped {skipped} existing products.")


if __name__ == "__main__":
    asyncio.run(main())
