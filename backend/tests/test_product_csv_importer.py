from pathlib import Path

from app.utils.product_csv_importer import ImportedProduct, parse_product_csv


def test_parse_product_csv_detects_brand_sections_and_product_rows(tmp_path: Path):
    csv_path = tmp_path / "products.csv"
    csv_path.write_text(
        "\n".join(
            [
                ",DEXCOM,NDC/NRC,Condition,7 months +,6 months,5 months",
                ",Dexcom G7 Sensor (STP-AT-012),08627-0077-01,Mint,$80.00,$80.00,Ask",
                ",,,Ding,$77.00,$77.00,Ask",
                ",Omnipod,NDC/NRC,Condition,7 months+,6 months,5 months",
                ",Omnipod - 5 pack (G6/G7) Retail,08508-3000-21,Mint,$225.00,N/A,N/A",
            ]
        ),
        encoding="utf-8",
    )

    products = parse_product_csv(csv_path, default_image_url="/uploads/placeholder.svg")

    assert products == [
        ImportedProduct(
            name="Dexcom G7 Sensor (STP-AT-012)",
            brand="DEXCOM",
            serial_number="08627-0077-01",
            short_description="Condition: Mint",
            image_url="/uploads/placeholder.svg",
            category="dexcom",
        ),
        ImportedProduct(
            name="Omnipod - 5 pack (G6/G7) Retail",
            brand="OMNIPOD",
            serial_number="08508-3000-21",
            short_description="Condition: Mint",
            image_url="/uploads/placeholder.svg",
            category="omnipod",
        ),
    ]


def test_parse_product_csv_skips_duplicate_brand_name_serial_rows(tmp_path: Path):
    csv_path = tmp_path / "products.csv"
    csv_path.write_text(
        "\n".join(
            [
                ",ACCU-CHEK,NDC/NRC,Condition,9 months+,7-8 months,6 months",
                ",Accu-Chek Guide 50 Retail,65702-0711-10,Mint,$14.00,$11.00,$8.00",
                ",Accu-Chek Guide 50 Retail,65702-0711-10,Mint,$14.00,$11.00,$8.00",
            ]
        ),
        encoding="utf-8",
    )

    products = parse_product_csv(csv_path)

    assert len(products) == 1
    assert products[0].brand == "ACCU-CHEK"
    assert products[0].name == "Accu-Chek Guide 50 Retail"
