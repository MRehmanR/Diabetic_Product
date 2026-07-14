# Category image placement

Put homepage category images in this folder when you want custom images for
the "Browse by Category" section.

Recommended filenames:

- `glucose-meters.jpg`
- `test-strips.jpg`
- `lancets.jpg`
- `insulin-supplies.jpg`
- `sugar-free-foods.jpg`
- `medicine-accessories.jpg`
- `foot-care.jpg`
- `bp-monitors.jpg`
- `supplements.jpg`
- `medical-equipment.jpg`

After adding images, import them in `frontend/src/routes/index.tsx` and replace
the matching entries in `categoryImageFallbacks`.

The current fallback behavior is:

1. Use the product image from the backend if that category has one.
2. Otherwise use the local fallback image from `categoryImageFallbacks`.
