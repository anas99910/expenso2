# Moroccan Household Inventory App 🇲🇦

A Flutter application designed for Moroccan households to track pantry, cleaning supplies, and generate shopping lists automatically.

## 📱 Features
- **Track Inventory**: Add items with categories (Kitchen, Living Room, etc.) and Moroccan units (kg, liter, bottle, box, etc.).
- **Smart Shopping List**: Auto-generates list based on `Low` or `Need to Buy` status.
- **Offline First**: Uses Hive for fast, local storage.
- **Dark Mode**: Material 3 design with System Dark Mode support.

## 🛠 Project Structure
- `lib/core`: Constants, Theme.
- `lib/features/inventory`: Domain, Data, and UI for inventory management.
- `lib/features/shopping_list`: UI for shopping list.

## 🚀 Setup & Run
Since this project was generated without the Flutter CLI, follow these steps to run it:

1.  **Dependencies**: ensure your `pubspec.yaml` is in the root.
2.  **Get Packages**:
    ```bash
    flutter pub get
    ```
3.  **Generate Hive Adapters** (Critical Step):
    ```bash
    flutter pub run build_runner build --delete-conflicting-outputs
    ```
    *This will generate `item_model.g.dart` which is required for the database to work.*

4.  **Run the App**:
    ```bash
    flutter run
    ```

## 🏗 Architecture
Built with **Clean Architecture**:
- **Domain**: Pure Dart entities (`Item`) and Repository Interfaces.
- **Data**: Hive Models (`ItemModel`) and Repository Implementation.
- **Presentation**: Riverpod (`StateNotifierProvider`) and Material 3 Widgets.
